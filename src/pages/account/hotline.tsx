import { Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GridDX from "../../components/layout/griddx";
import PakQatarLogo from "../../assets/pak_qatar_logo_2.png";
import { handleCall } from "../../shared/globals";
import { useMediaQuery } from "@mui/material";
import service from "../../assets/icons/service.png";
const Hotline = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const makeCallLink = (number: string) => (
    <Typography
      onClick={(e) => handleCall(e, number)}
      color="primary"
      sx={{ fontSize: 20, ml: 1, fontWeight: "bold" }}
    >
      {number}
    </Typography>
  );

  return (
    <GridDX container sx={{ width: "100%" }}>
      <GridDX item xs={12} justifyContent="center" sx={{ textAlign: "center" }}>
        <Typography
          sx={{ fontSize: 24, textTransform: "uppercase", fontWeight: "bold" }}
          color="primary"
        >
          Emergency Hotline
        </Typography>
      </GridDX>
      <GridDX
        item
        xs={5}
        sm={6}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          pr: "30px",
          mt: "20px",
        }}
      >
        <img src={service} height={80}></img>
      </GridDX>
      <GridDX
        item
        xs={7}
        sm={6}
        sx={{ display: "flex", flexDirection: "column", mt: "20px" }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          {makeCallLink("0301-8243495")}
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          {makeCallLink("0301-8223385")}
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          {makeCallLink("0302-8223385")}
        </Typography>
      </GridDX>

      <GridDX item xs={12} justifyContent="center" mt={4}>
        <img src={PakQatarLogo} alt="Pak Qatar Logo" height={145} />
      </GridDX>
    </GridDX>
  );
};

export default Hotline;
