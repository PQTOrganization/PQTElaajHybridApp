import { useEffect, useState } from "react";
import { Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import GoBackIcon from "@mui/icons-material/ArrowBack";
const SecondaryAppBarDX = () => {
  const routeMap = new Map<string, string>([
    ["notifications", "Notifications"],
    ["profile", "Profile"],
    ["claim-history", "Claim History"],
    ["claim-reimburse", "Claim Reimburse"],
    ["create-claim", "Submit Claim"],
    ["pending-claims", "Pending Claims"],
    ["benefits-limits", "Benefits & Limits"],
    ["contact-us", "Contact Us"],
    ["launch-complaint", "Complaints"],
    ["manage-complaint", "Manage Complaint"],
    ["preauthorization", "Create Pre-Authorization"],
    ["products-solutions", "Takaful Products & Services"],
    ["record-correction", "Record Correction"],
    ["tele-doctor", "Tele Doctor"],
    ["value-added-services", "Value Added Services"],
    ["view-card", "Health Card"],
    ["opd-reimburse", "OPD Reimburse"],
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  const [pageHeading, setPageHeading] = useState("Dashboard");

  useEffect(() => {
    const pathName = location.pathname.substring(1);
    setPageHeading(routeMap.get(pathName) ?? "Page Title");
  }, [location.pathname]);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: 0,
        borderTop: "6px solid #007A48",
        borderRadius: 2,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          color="primary"
        >
          {pageHeading}
        </Typography>
        <IconButton
          size="large"
          color="primary"
          onClick={() => {
            navigate(-1);
          }}
        >
          <GoBackIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default SecondaryAppBarDX;
