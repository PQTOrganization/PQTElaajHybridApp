import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Typography } from "@mui/material";

import GridDX from "../../components/layout/griddx";
import MemberCard from "../../components/controls/membercard";
import MemberSelector from "../../components/business/memberselector";
import ClaimCard from "../../components/business/claimcard";
import ParticipantSelector from "../../components/business/particpantselector";

import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import {
  getAllClaims,
  getDocumentTypes,
} from "../../shared/services/claimservice";
import { getMembers } from "../../shared/services/memberservice";

const PendingClaims = () => {
  const { getUserDetails, isAdminUser, getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const [members, setMembers] = useState<any>([]);
  const [pendingClaims, setPendingClaims] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [documentTypes, setDocumentTypes] = useState<any>([]);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      setUserDetails(userDetails);

      const token = getToken();
      getDocumentTypes(token)
        .then((response) => {
          setDocumentTypes(response);

          if (!isAdminUser()) {
            loadMembersData(userDetails.policyNumber, userDetails.employeeCode);
          }
        })
        .catch((err) => setError(err));
    });
  }, []);

  useEffect(() => {
    if (selectedIndex > -1 && members[selectedIndex]) {
      setLoadingDetails(true);

      getUserDetails().then((userDetails: any) => {
        const token = getToken();
        getAllClaims(
          userDetails.policyNumber,
          members[selectedIndex].employeeSRNumber,
          null,
          null,
          token
        )
          .then((resp) => {
            console.log({ resp });

            setPendingClaims(
              resp.filter((c: any) => c.statusDescription === "Pending")
            );
          })
          .catch((err) => setError(err))
          .finally(() => setLoadingDetails(false));
      });
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

  const onChange = (membersIndex: any) => {
    setSelectedIndex(membersIndex);
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
              handleCallBack={onChange}
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
            ) : pendingClaims.length === 0 ? (
              <Typography
                sx={{ my: 2, fontWeight: "bold", textAlign: "center" }}
                color="primary"
              >
                No Pending Claims found for the member
              </Typography>
            ) : (
              pendingClaims.map((c: any, index: number) => (
                <ClaimCard
                  key={"rc_data_" + index}
                  data={c}
                  documentTypes={documentTypes}
                />
              ))
            )}
          </GridDX>
        </>
      )}
    </GridDX>
  );
};

export default PendingClaims;
