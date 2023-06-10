import { Outlet, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import GoBackIcon from "@mui/icons-material/ArrowBack";

import GridDX from "../components/layout/griddx";

const WebPageViewTemplate = () => {
  const navigate = useNavigate();

  return (
    <GridDX
      container
      sx={{ height: "100vh", width: "100%", flexDirection: "column" }}
    >
      <GridDX
        item
        xs={12}
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <IconButton
          size="large"
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "white",
            zIndex: 10,
          }}
        >
          <GoBackIcon />
        </IconButton>
        <Outlet />
      </GridDX>
    </GridDX>
  );
};

export default WebPageViewTemplate;
