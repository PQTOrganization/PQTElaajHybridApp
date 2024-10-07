import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import ButtonDX from "../../components/controls/buttondx";
import GridDX from "../../components/layout/griddx";
import ClaimBox from "../../components/business/claimbox";
import ClaimCard from "../../components/business/claimcard";
import AlertComponenet from "../../components/alerts/alert";

import { getClaim, getClaimSummary } from "../../shared/services/claimservice";

const Claims = () => {
  const navigate = useNavigate();

  const { getUserDetails, getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState<any>(null);
  const [summary, setSummary] = useState({
    approvedClaims: 0,
    savings: 0,
    totalClaims: 0,
    membersCovered: 0,
    totalLimit: 0,
    balanceLimit: 0,
    totalClaimAmount: 0,
    totalPaidAmount: 0,
  });

  useEffect(() => {
    getUserDetails()
      .then((resp: any) => {
        RecentClaims(resp.policyNumber, resp.employeeCode);
        ClaimSummary(resp.policyNumber, resp.certNumber, resp.employeeCode);
      })
      .catch((err: any) => setError(err));
  }, []);

  const ClaimSummary = (
    policyNo: string,
    empSRNumber: string,
    employeeCode: string
  ) => {
    const token = getToken();
    getClaimSummary(policyNo, empSRNumber, employeeCode, token)
      .then((resp) => {
        setSummary(resp);
      })
      .catch((err) => setError(err));
  };

  const RecentClaims = (policyNo: string, empCode: string) => {
    const token = getToken();
    getClaim(policyNo, empCode, token)
      .then((resp) => {
        setData(resp);
      })
      .catch((err) => setError(err));
  };

  const checkPreAuthBenefits = (link: string) => {
    getUserDetails().then((userDetails: any) => {
      if (userDetails.benefits) {
        const hasPreAuthBenefit = userDetails.benefits.findIndex(
          (b: any) =>
            b.benefitCode === "BGHTV02" ||
            b.benefitCode === "RGHMMV01" ||
            b.benefitCode === "BGHTVS02" ||
            b.benefitCode === "RGHMMV01" ||
            b.benefitCode === "RGHMMVS01"
        );

        if (hasPreAuthBenefit === -1) {
          setShowAlert(true);
          return;
        }
      }

      navigate(link);
    });
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start", height: "100%", overflowY:"auto"}}
      rowSpacing={2}
      columnSpacing={1}
    >
      <AlertComponenet
        open={showAlert}
        alert="This provision not available for your Policy"
        handleClose={() => setShowAlert(false)}
      />

      <GridDX item xs={6}>
        <ClaimBox title="Persons Covered" value={summary.membersCovered} />
      </GridDX>
      <GridDX item xs={6}>
        <ClaimBox title="Total Claims" value={summary.totalClaims} />
      </GridDX>
      <GridDX item xs={6}>
        <ClaimBox title="Total Claim Amount" value={summary.totalClaimAmount} />
      </GridDX>
      <GridDX item xs={6}>
        <ClaimBox title="Total Paid Amount" value={summary.totalPaidAmount} />
      </GridDX>
      <GridDX item xs={12} justifyContent="space-evenly" sx={{ py: 2 }}>
        <ButtonDX
          color="success"
          onClick={() => navigate("/create-claim")}
          sx={{
            backgroundColor: "green !important",
            width: "190px",
            borderRadius: "50px",
          }}
        >
          Submit Claim
        </ButtonDX>
      </GridDX>
      <GridDX item xs={12}>
        <Typography sx={{ fontSize: 24 }} color="primary">
          Recent Claims
        </Typography>
      </GridDX>
      <GridDX item xs={12} sx={{ flexDirection: "column" }}>
        {data !== null ? (
          data.map((c: any, index: number) => (
            <ClaimCard key={"rc_data_" + index} data={c} />
          ))
        ) : (
          <Skeleton
            containerClassName="skeleton-container"
            count={4}
            style={{ height: 150, marginBottom: 8 }}
          />
        )}
      </GridDX>
    </GridDX>
  );
};

export default Claims;
