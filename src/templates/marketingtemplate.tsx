import { Outlet } from "react-router-dom";

import GridDX from "../components/layout/griddx";

const MarketingTemplate = () => {
  return (
    <GridDX
      container
      sx={{
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        justifyContent: "end",
        p: 2,
        background: 'url("../../assets/marketing/marketing_slide_1.png")',
        backgroundPositionX: "center",
        backgroundPositionY: "16px",
        backgroundRepeat: "no-repeat",
        backgroundColor: "white",
      }}
    >
      <Outlet />
    </GridDX>
  );
};

export default MarketingTemplate;
