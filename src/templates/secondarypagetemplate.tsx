import { Outlet } from "react-router-dom";
import SecondaryAppBarDX from "../components/appbars/secondaryappbar";
import GridDX from "../components/layout/griddx";
import NotificationBarDX from "../components/notificationbardx";

const SecondaryPageTemplate = () => {
  return (
    <GridDX
      container
      sx={{ height: "100vh", width: "100%", flexDirection: "column" }}
    >
      <GridDX item xs={12}>
        <SecondaryAppBarDX />
      </GridDX>
      <GridDX
        item
        xs={12}
        sx={{
          padding: 16,
          height: "calc(100vh - 70px)",
          overflow: "scroll",
        }}
      >
        <NotificationBarDX />
        <Outlet />
      </GridDX>
    </GridDX>
  );
};

export default SecondaryPageTemplate;
