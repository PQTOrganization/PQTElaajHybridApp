import React, { useEffect, useState } from "react";
import { Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import AppDrawerDX from "../layout/appdrawerdx";

import BellIcon from "@mui/icons-material/Notifications";

const DashboardBoardAppBarDX = () => {
  const routeMap = new Map<string, string>([
    ["home", "Welcome to Pak-Qatar Takaful"],
    ["claims", "Claims"],
    ["panel-hospitals", "Panel Hospitals"],
    ["call", "Call"],
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
          onClick={() => navigate("/notifications")}
        >
          <BellIcon />
        </IconButton>
        <AppDrawerDX />
      </Toolbar>
    </AppBar>
  );
};

export default DashboardBoardAppBarDX;
