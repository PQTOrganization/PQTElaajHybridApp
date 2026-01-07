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
import MenuIcon from "@mui/icons-material/Menu";
import AccountIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaidIcon from "@mui/icons-material/Paid";
import ClaimHistoryIcon from "@mui/icons-material/FileCopy";
import RecordCorrectionIcon from "@mui/icons-material/NoteAlt";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import UserIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import BenefitsAndLimits from "../../assets/icons/BenefitsAndLimits.png";
import ClaimHistory from "../../assets/icons/ClaimHistory.png";
import RecordCorrection from "../../assets/icons/RecordCorrection.png";
import ValueAddedServices from "../../assets/icons/ValueAddedServices.png";
import TakafulProduct from "../../assets/icons/TakafulProduct.png";
import Elaaj_App_Screen from "../../assets/Elaaj_App_Screen.jpg";
import pak_qatar_semi_circle_logo_2 from "../../assets/pak_qatar_semi_circle_logo_2.png";

import GridDX from "./griddx";

import { useAuthContext } from "../../context/authcontext";
import { getProfileImageFromDevice, logOnMobile } from "../../shared/globals";

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
      icon: <img src={BenefitsAndLimits} style={{ width: "35px" }} />,
      link: "/benefits-limits",
    },
    {
      title: "Claim History",
      icon: <img src={ClaimHistory} style={{ width: "35px" }} />,
      link: "/claim-history",
    },
    {
      title: "Record Correction",
      icon: <img src={RecordCorrection} style={{ width: "35px" }} />,
      link: "/record-correction",
    },
    {
      title: "Value Added Services",
      icon: <img src={ValueAddedServices} style={{ width: "35px" }} />,
      link: "/value-added-services",
    },
    {
      title: "Takaful Product & Solutions",
      icon: <img src={TakafulProduct} style={{ width: "35px" }} />,
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
      link: "/",
    },
  ];

  const navigate = useNavigate();
  const { getUserDetails, signOut } = useAuthContext();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [user, setUser] = useState<any>(null);

  const [state, setState] = useState({
    left: false,
  });

  useEffect(() => {
    getUserDetails().then((user: any) => {
      setUser(user);
      const win: any = window;
      if (win?.ReactNativeWebView) {
        // logOnMobile("fetching profile image from device");
        getProfileImageFromDevice(user.userId);
      }
    });

    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    document.addEventListener("message", photoFromApp, false);
    window.addEventListener("message", photoFromApp, false); // for IOS

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const photoFromApp = async (message: any) => {
    // Evading exception thrown when message is processed even when application is running directly on browser
    try {
      let jsonData = JSON.parse(message.data);

      // logOnMobile("received profile image from device" + jsonData.data);
      if (jsonData.data && jsonData.data !== "" && jsonData.data !== "null") {
        let imgBase64 = "data:image/png;base64," + jsonData.data;

        setUser({
          ...user,
          ["profileImage"]: imgBase64,
        });
      }
    } catch (error) {
      // console.error("Error parsing message data:", error);
    }
  };

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
            if (link === "/signin" || link === "/") {
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
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        PaperProps={{
          sx: {
            width: "100%",

            backgroundImage: isDesktop
              ? `url(${pak_qatar_semi_circle_logo_2})`
              : `url(${Elaaj_App_Screen})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          },
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
            {user?.profileImage != "" && user?.profileImage != null ? (
              <img
                src={user?.profileImage}
                style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              />
            ) : (
              <UserIcon fontSize="large" />
            )}
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
