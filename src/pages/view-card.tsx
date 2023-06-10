import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { useErrorContext } from "../context/errorcontext";
import { useAuthContext } from "../context/authcontext";

import GridDX from "../components/layout/griddx";
import ButtonDX from "../components/controls/buttondx";
import PhysicalCardFront from "../components/business/physicalcardfront";
import PhysicalCardBack from "../components/business/physicalcardback";

import { getMembers } from "../shared/services/memberservice";

const ViewCard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getUserDetails, getToken } = useAuthContext();
  const { setInfo, setError } = useErrorContext();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [familyMembers, setFamilyMembers] = useState(null);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      const token = getToken();

      getMembers(userDetails.policyNumber, userDetails.employeeCode, token)
        .then((members) => {
          setMember(
            members.filter(
              (x: any) => x.employeeSRNumber === userDetails.certNumber
            )[0]
          );
          setFamilyMembers(
            members.filter(
              (x: any) => x.employeeSRNumber !== userDetails.certNumber
            )
          );
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start" }}
      rowSpacing={1}
    >
      <GridDX
        item
        xs={12}
        sx={{
          display: "block",
          maxHeight: 250,
        }}
      >
        <PhysicalCardFront
          loading={loading}
          member={member}
          familyMembers={familyMembers}
        />
      </GridDX>
      <GridDX item xs={12}>
        <PhysicalCardBack />
      </GridDX>
    </GridDX>
  );
};

export default ViewCard;
