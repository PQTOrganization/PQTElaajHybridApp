import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import moment from "moment";

import GridDX from "../../components/layout/griddx";
import MemberSelector from "../../components/business/memberselector";
import ClaimCard from "../../components/business/claimcard";
import MemberCard from "../../components/controls/membercard";
import ParticipantSelector from "../../components/business/particpantselector";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import { getAllClaims } from "../../shared/services/claimservice";
import {
  getMemberPolicyPeriods,
  getMembers,
} from "../../shared/services/memberservice";
import SelectListDX from "../../components/controls/selectlistdx";

const ClaimHistory = () => {
  const { getUserDetails, isAdminUser, getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const [data, setData] = useState<any>([]);
  const [members, setMembers] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [policyPeriods, setPolicyPeriods] = useState<any>([]);
  const [periodList, setPeriodList] = useState<any>([]);
  const [policyPeriod, setPolicyPeriod] = useState(0);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      setUserDetails(userDetails);

      if (!isAdminUser()) {
        loadMembersData(userDetails.policyNumber, userDetails.employeeCode);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedIndex > -1 && members[selectedIndex] && policyPeriod !== 0) {
      refreshClaimsList();
    }
  }, [selectedIndex, policyPeriod]);

  useEffect(() => {
    if (isAdminUser() && selectedParticipant) {
      loadMembersData(
        selectedParticipant.policyNumber,
        selectedParticipant.employeeCode
      );
    }
  }, [selectedParticipant]);

  const loadMembersData = async (
    policyNumber: string,
    employeeCode: string
  ) => {
    setLoading(true);

    const token = getToken();

    return Promise.all([
      getMembers(policyNumber, employeeCode, token).then((members) => {
        setMembers(members);
        setSelectedIndex(0);
      }),
      getMemberPolicyPeriods(policyNumber, token).then((policyPeriods) => {
        setPolicyPeriods(policyPeriods);

        setPeriodList(
          policyPeriods.map((item: any) => {
            return {
              text:
                moment(item.periodFrom).format("DD/MMM/YYYY") +
                " - " +
                moment(item.periodTo).format("DD/MMM/YYYY"),
              value: item.documentYear,
            };
          })
        );

        setPolicyPeriod(policyPeriods[0].documentYear);
      }),
    ])
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const onMemberChange = (membersIndex: any) => {
    setSelectedIndex(membersIndex);
  };

  const handlePeriodChange = (e: any) => {
    const { value } = e.target;
    setPolicyPeriod(value);
  };

  const refreshClaimsList = () => {
    setLoadingDetails(true);

    getUserDetails().then((userDetails: any) => {
      const period = policyPeriods.find(
        (p: any) => p.documentYear === policyPeriod
      );

      const token = getToken();

      getAllClaims(
        userDetails.policyNumber,
        members[selectedIndex].employeeSRNumber,
        period?.periodFrom,
        period?.periodTo,
        token
      )
        .then((resp) => {
          setData(resp);
        })
        .catch((err) => setError(err))
        .finally(() => setLoadingDetails(false));
    });
  };

  const onParticipantSelected = (participant: any) => {
    setSelectedParticipant(participant);
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start", height: "100%" }}
      rowSpacing={2}
    >
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
          <GridDX item xs={12}>
            <SelectListDX
              label="Policy Period"
              name="policyPeriodId"
              items={periodList}
              value={policyPeriod}
              onChange={handlePeriodChange}
              loading={loading}
            />
          </GridDX>
          <GridDX item xs={12} sx={{ px: 3 }}>
            <MemberCard member={members[selectedIndex]} loading={loading} />
          </GridDX>

          <GridDX item xs={12} sx={{ flexDirection: "column" }}>
            {loadingDetails ? (
              <Skeleton
                containerClassName="skeleton-container"
                count={4}
                style={{ height: 150, marginBottom: 8 }}
              />
            ) : data.length === 0 ? (
              <Typography
                sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}
                color="primary"
              >
                No Claims found for the member
              </Typography>
            ) : (
              data.map((c: any, index: number) => (
                <ClaimCard key={"rc_data_" + index} data={c} />
              ))
            )}
          </GridDX>
        </>
      )}
    </GridDX>
  );
};

export default ClaimHistory;
