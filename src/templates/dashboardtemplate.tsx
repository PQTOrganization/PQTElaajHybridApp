import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import GridDX from "../components/layout/griddx";
import BottomBarDX from "../components/appbars/bottombardx";
import AppBarDX from "../components/appbars/dashboardappbardx";
import NotificationBarDX from "../components/notificationbardx";

const DashboardTemplate = () => {
  const location = useLocation();
  const [transitionName, setTransitionName] = useState("next");
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = (e: any) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
      setIsBottom(true);
    } else if (isBottom) {
      setIsBottom(false);
    }
  };

  return (
    <GridDX
      container
      sx={{ height: "100%", width: "100%", flexDirection: "column" }}
    >
      <GridDX item xs={12}>
        <AppBarDX />
      </GridDX>
      <GridDX
        item
        xs={12}
        sx={{
          padding: 16,
          height: "calc(100vh - 120px)",
          overflow: location.pathname === "home" ? "hidden" : "auto",
          position: "relative",
          flexDirection: "column",
        }}
        //onScroll={handleScroll}
      >
        <NotificationBarDX />
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames={transitionName}
            timeout={2000}
          >
            <Outlet context={isBottom} />
          </CSSTransition>
        </TransitionGroup>
      </GridDX>
      <GridDX item xs={12}>
        <BottomBarDX />
      </GridDX>
    </GridDX>
  );
};

export default DashboardTemplate;
