import { Typography, CardContent, useTheme, Divider } from "@mui/material";
import moment from "moment";

import InReviewIcon from "@mui/icons-material/RemoveRedEye";
import ApprovedIcon from "@mui/icons-material/CheckCircle";
import RejectedIcon from "@mui/icons-material/Close";
import MemberAvatar from "@mui/icons-material/AccountCircle";

import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";

const ComplaintCard = (props: any) => {
  const theme = useTheme();

  const complainData = props.data;
  //   {
  //     status: 1,
  //     complainDate: "20230201",
  //     subject: "Everything has gone wrong",
  //     complainTypeName: "Feedback",
  //   }; //

  const complainStatus = ["", "Open", "Closed"];

  const statusColor = () => {
    switch (complainData.status) {
      case 1:
        return theme.palette.warning.main;

      case 2:
        return theme.palette.success.main;

      default:
        return "#FF7A00";
    }
  };

  const statusIcon = () => {
    switch (complainData.status) {
      case 2:
        return <ApprovedIcon />;

      default:
        return <InReviewIcon />;
    }
  };

  return (
    <CardDX
      key={"complain_card_" + complainData.complainId}
      sx={{ width: "100%", my: 1 }}
      onClick={() =>
        props.onClick ? props.onClick(complainData.complainId) : null
      }
    >
      <CardContent>
        <GridDX
          container
          sx={{ width: "100%", alignItems: "center" }}
          rowSpacing={1}
        >
          <GridDX item xs={8}>
            <Typography sx={{ fontWeight: 700, color: statusColor() }}>
              {moment(complainData.complainDate).format("DD-MMM-yyyy")}
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
                fontSize: 12,
                fontWeight: 500,

                textTransform: "uppercase",
              }}
            >
              {complainStatus[complainData.status]}
            </Typography>
            {statusIcon()}
          </GridDX>
          <GridDX item xs={12}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {complainData.complainTypeName}
            </Typography>
          </GridDX>
          <GridDX item xs={12}>
            <Divider sx={{ flex: 1 }} />
          </GridDX>
          <GridDX item xs={12}>
            <Typography>{complainData.subject}</Typography>
          </GridDX>
        </GridDX>
      </CardContent>
    </CardDX>
  );
};

export default ComplaintCard;
