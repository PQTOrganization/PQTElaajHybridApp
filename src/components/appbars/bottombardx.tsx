import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ClaimsIcon from "@mui/icons-material/Lock";
import PanelIcon from "@mui/icons-material/LocalHospital";
import CallIcon from "@mui/icons-material/SupportAgent";

import { handleCall } from "../../shared/globals";

const BottomBarDX = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  return (
    <Paper
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        sx={{
          bgcolor: "#8B0037",
          color: "#FFF",
          "& .Mui-selected": {
            "& .MuiBottomNavigationAction-label": {
              fontSize: (theme) => theme.typography.caption,
              transition: "none",
              lineHeight: "20px",
            },
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "#FFF",
              opacity: 1,
            },
          },
          "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
            color: "#FFFFFF",
            opacity: 0.74,
          },
        }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => navigate("/home")}
        />
        <BottomNavigationAction
          label="Claims"
          icon={<ClaimsIcon />}
          onClick={() => navigate("/claims")}
        />
        <BottomNavigationAction
          label="Panel"
          icon={<PanelIcon />}
          onClick={() => navigate("/panel-hospitals")}
        />
        <BottomNavigationAction
          label="Call"
          icon={<CallIcon />}
          onClick={handleCall}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBarDX;
