import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import moment from "moment";

import { useAuthContext } from "../context/authcontext";
import { useErrorContext } from "../context/errorcontext";

import CoverageTable from "../components/business/coveragetable";
import MemberSelector from "../components/business/memberselector";
import MemberCard from "../components/controls/membercard";
import GridDX from "../components/layout/griddx";
import AlertComponenet from "../components/alerts/alert";
import ParticipantSelector from "../components/business/particpantselector";

import {
  getMemberBenefits,
  getMembers,
} from "../shared/services/memberservice";

const BenefitsLimits = () => {
  const { getUserDetails, isAdminUser, getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const [coverageData, setCoverageData] = useState<any>();
  const [members, setMembers] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [currentDateTime, setCurrentDateTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(moment()), 1000);

    getUserDetails().then((userDetails: any) => {
      setUserDetails(userDetails);

      if (!isAdminUser()) {
        loadMembersData(userDetails.policyNumber, userDetails.employeeCode);
      }
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (selectedIndex > -1 && members[selectedIndex]) {
      setLoadingDetails(true);
      const token = getToken();
      getMemberBenefits(
        members[selectedIndex].policyNumber,
        members[selectedIndex].employeeSRNumber,
        token
      )
        .then((resp) => {
          setCoverageData(resp);
        })
        .catch((err) => setError(err))
        .finally(() => setLoadingDetails(false));
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (isAdminUser() && selectedParticipant) {
      loadMembersData(
        selectedParticipant.policyNumber,
        selectedParticipant.employeeCode
      );
    }
  }, [selectedParticipant]);

  const loadMembersData = (policyNumber: string, employeeCode: string) => {
    setLoading(true);
    const token = getToken();
    getMembers(policyNumber, employeeCode, token)
      .then((members) => {
        setMembers(members);
        setSelectedIndex(0);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const onMemberChange = (memberIndex: number) => {
    setSelectedIndex(memberIndex);
  };

  const onParticipantSelected = (participant: any) => {
    setSelectedParticipant(participant);
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start", height: "100%" }}
      rowSpacing={3}
    >
      <AlertComponenet
        open={showAlert}
        alert="This provision not available for your Policy"
        handleClose={() => setShowAlert(false)}
      />

      {isAdminUser() && (
        <GridDX item xs={12}>
          <ParticipantSelector
            loading={loading}
            userData={userDetails}
            onSelected={onParticipantSelected}
          />
        </GridDX>
      )}

      {(!isAdminUser() || (isAdminUser() && selectedParticipant)) && (
        <>
          <GridDX item xs={12}>
            <MemberSelector
              loading={loading}
              list={members}
              handleCallBack={onMemberChange}
            />
          </GridDX>
          <GridDX item xs={12} sx={{ px: 3 }}>
            <MemberCard member={members[selectedIndex]} loading={loading} />
          </GridDX>
          <GridDX item xs={12}>
            <GridDX container sx={{ width: "100%" }} rowSpacing={1}>
              
              <GridDX item xs={12}>
                <CoverageTable
                  data={coverageData}
                  loading={loading || loadingDetails}
                />
              </GridDX>
            </GridDX>
          </GridDX>
          <GridDX item xs={12} justifyContent="flex-end">
            <Typography sx={{ fontWeight: "bold" }} color="primary">
              {currentDateTime.format("DD-MMM-yyyy hh:mm:ss A")}
            </Typography>
          </GridDX>
        </>
      )}
    </GridDX>
  );
};

export default BenefitsLimits;
