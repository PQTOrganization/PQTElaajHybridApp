import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import AccountIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaidIcon from "@mui/icons-material/Paid";
import ClaimHistoryIcon from "@mui/icons-material/FileCopy";
import RecordCorrectionIcon from "@mui/icons-material/NoteAlt";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import UserIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

import GridDX from "./griddx";

import { useAuthContext } from "../../context/authcontext";

type Anchor = "top" | "left" | "bottom" | "right";

const AppDrawerDX = () => {
  const itemsList = [
    {
      title: "Profile",
      icon: <ManageAccountsIcon fontSize="large" />,
      link: "/profile",
    },
    {
      title: "Benefits & Limits",
      icon: <PaidIcon fontSize="large" />,
      link: "/benefits-limits",
    },
    {
      title: "Claim History",
      icon: <ClaimHistoryIcon fontSize="large" />,
      link: "/claim-history",
    },
    {
      title: "Record Correction",
      icon: <RecordCorrectionIcon fontSize="large" />,
      link: "/record-correction",
    },
    {
      title: "Value Added Services",
      icon: <ErrorOutlineOutlinedIcon fontSize="large" />,
      link: "/value-added-services",
    },
    {
      title: "Takaful Product & Solutions",
      icon: <ErrorOutlineOutlinedIcon fontSize="large" />,
      link: "/products-solutions",
    },
    {
      title: "Launch Complaint",
      icon: <ErrorOutlineOutlinedIcon fontSize="large" />,
      link: "/launch-complaint",
    },
    {
      title: "Logout",
      icon: <LogoutIcon fontSize="large" />,
      link: "/signin",
    },
  ];

  const navigate = useNavigate();
  const { getUserDetails, signOut } = useAuthContext();

  const [user, setUser] = useState<any>(null);

  const [state, setState] = useState({
    left: false,
  });

  useEffect(() => {
    getUserDetails().then((user: any) => setUser(user));
  }, []);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const drawListItem = (icon: any, text: string, link: string) => {
    return (
      <ListItem key={text} disablePadding>
        <ListItemButton
          onClick={() => {
            if (link === "/signin") {
              signOut();
              navigate(link, { replace: true });
            } else navigate(link);
          }}
        >
          <ListItemIcon sx={{ fontSize: "large" }}>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: "auto",
        mx: 1.5,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {itemsList.map((item, index) =>
          drawListItem(item.icon, item.title, item.link)
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer("left", true)}
        size="large"
        color="primary"
        aria-label="account of current user"
      >
        <AccountIcon />
      </IconButton>
      <SwipeableDrawer
        PaperProps={{
          sx: { width: "100%" },
        }}
        anchor={"right"}
        open={state["left"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        <GridDX container spacing={1} sx={{ mx: 2, my: 2 }}>
          <GridDX item xs={12} justifyContent="flex-end">
            <CloseIcon
              fontSize="medium"
              style={{ cursor: "pointer" }}
              onClick={toggleDrawer("left", false)}
            />
          </GridDX>
          <GridDX
            item
            xs={2}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <UserIcon fontSize="large" />
          </GridDX>
          <GridDX
            item
            xs={10}
            sx={{ color: "#000000", opacity: 0.6, flexDirection: "column" }}
          >
            <Typography sx={{ opacity: 1 }}>Welcome</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "larger" }}>
              {user?.employeeName}
            </Typography>
            <Typography>Policy # {user?.policyNumber}</Typography>
          </GridDX>
        </GridDX>
        {list("right")}
      </SwipeableDrawer>
    </div>
  );
};

export default AppDrawerDX;
