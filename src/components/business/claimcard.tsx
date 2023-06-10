import { useState } from "react";
import {
  Typography,
  CardContent,
  useTheme,
  Dialog,
  IconButton,
} from "@mui/material";
import moment from "moment";

import InReviewIcon from "@mui/icons-material/RemoveRedEye";
import ApprovedIcon from "@mui/icons-material/CheckCircle";
import RejectedIcon from "@mui/icons-material/Close";
import MemberAvatar from "@mui/icons-material/AccountCircle";
import GoBackIcon from "@mui/icons-material/ArrowBack";

import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";
import { formattedNumber } from "../../shared/globals";

const ClaimCard = (props: any) => {
  const theme = useTheme();
  const claimData = props.data;
  const [show, setShow] = useState(false);

  const statusColor = () => {
    switch (claimData.statusDescription) {
      case "Full Settlement":
        return theme.palette.success.main;

      case "Rejected":
        return theme.palette.error.main;

      default:
        return "#FF7A00";
    }
  };

  const statusIcon = () => {
    switch (claimData.statusDescription) {
      case "Full Settlement":
        return <ApprovedIcon />;

      case "Rejected":
        return <RejectedIcon />;

      default:
        return <InReviewIcon />;
    }
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={0}>
      <CardDialogue
        show={show}
        setShow={setShow}
        claimData={claimData}
        statusColor={statusColor}
        statusIcon={statusIcon}
      />

      <CardDX
        sx={{ width: "100%", my: 1, cursor: "pointer" }}
        onClick={() => setShow(true)}
      >
        <CardContent>
          <GridDX container sx={{ width: "100%", alignItems: "center" }}>
            <GridDX item xs={8}>
              <Typography sx={{ fontWeight: 700, color: statusColor() }}>
                {claimData.claimReceivedDate}
              </Typography>
            </GridDX>
            <GridDX
              item
              xs={4}
              alignItems="center"
              justifyContent="space-between"
              sx={{ color: statusColor() }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 500,

                  textTransform: "uppercase",
                }}
              >
                {claimData.statusDescription}
              </Typography>
              {statusIcon()}
            </GridDX>
            <GridDX item xs={12}>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                Claim# {claimData?.claimNumber}
              </Typography>
            </GridDX>
            <GridDX item xs={9} sx={{ flexDirection: "column", py: 0 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  Claim Amount:
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, ml: 1 }}
                  color={theme.palette.success.main}
                >
                  {formattedNumber(claimData?.claimAmount)}
                </Typography>
              </div>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                Paid Amount: {formattedNumber(claimData?.paidAmount)}
              </Typography>
            </GridDX>
            <GridDX item xs={3} justifyContent="center" alignItems="center">
              <MemberAvatar fontSize="large" />
            </GridDX>
          </GridDX>
        </CardContent>
      </CardDX>
    </GridDX>
  );
};

export default ClaimCard;

const CardDialogue = (props: any) => {
  const claimData = props.claimData;
  return (
    <Dialog fullScreen open={props.show} onClose={() => props.setShow(false)}>
      <GridDX container>
        <GridDX item xs={1}>
          <IconButton size="large" onClick={() => props.setShow(false)}>
            <GoBackIcon />
          </IconButton>
        </GridDX>
        <GridDX item xs={11} justifyContent="center" alignItems="center">
          <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
            Claim Details
          </Typography>
        </GridDX>
        <GridDX item xs={12} sx={{ p: 2 }}>
          <GridDX
            container
            sx={{ width: "100%", alignItems: "center" }}
            rowSpacing={3}
          >
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Name:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>
                {claimData.employeeName +
                  " (" +
                  claimData.employeeRelation +
                  ")"}
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim#:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.claimNumber}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Claim Receiving Date:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              {claimData.claimReceivedDate}
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim Status:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              {claimData.statusDescription}
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim Type:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              {claimData.claimType}
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim Amount:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{formattedNumber(claimData.claimAmount)}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Paid Amount:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{formattedNumber(claimData?.paidAmount)}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Provider/Hospital:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData?.hospitalName}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Payment Mode:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData?.paymentMode}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Deduction Amount:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>
                {formattedNumber(claimData?.deductionAmount)}
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Deduction Reason:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData?.deductionReason}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Cheque Date:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>
                {claimData.chequeDate
                  ? moment(claimData.chequeDate).format("DD-MMM-YYYY")
                  : ""}
              </Typography>
            </GridDX>
            {/*<GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim CNIC:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.claimCNIC}</Typography>
            </GridDX>
             <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Coverage Description:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.coverageDescription}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>EmployeeSR #:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.employeeSRNumber}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Hospital Name:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.hospitalName}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Policy Number:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.policyNumber}</Typography>
            </GridDX> */}
          </GridDX>
        </GridDX>
      </GridDX>
    </Dialog>
  );
};
