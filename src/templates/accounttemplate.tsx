import { Outlet } from "react-router-dom";

import GridDX from "../components/layout/griddx";
import NotificationBarDX from "../components/notificationbardx";

const AccountTemplate = () => {
  return (
    <GridDX
      container
      sx={{
        height: "100vh",
        width: "100%",
        padding: 16,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NotificationBarDX />
      <Outlet />
    </GridDX>
  );
};

export default AccountTemplate;
