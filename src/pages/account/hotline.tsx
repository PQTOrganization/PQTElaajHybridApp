import { Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import GridDX from "../../components/layout/griddx";
import ElaajLogo from "../../assets/elaaj_logo.png";
import PakQatarLogo from "../../assets/pak_qatar_logo.png";
import ButtonDX from "../../components/controls/buttondx";
import { handleCall } from "../../shared/globals";

const Hotline = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const makeCallLink = (number: string) => (
    <Typography
      onClick={(e) => handleCall(e, number)}
      color={theme.palette.success.main}
      sx={{ fontSize: 20, textDecoration: "underline", ml: 1 }}
    >
      {number}
    </Typography>
  );

  return (
    <GridDX container sx={{ width: "100%", height: "100%" }} rowSpacing={2}>
      <GridDX item xs={12} justifyContent="center" sx={{ minHeight: 190 }}>
        <img src={ElaajLogo} alt="Elaaj Logo" height={175} />
      </GridDX>
      <GridDX item xs={12} justifyContent="center" style={{ mt: 2, mb: 1 }}>
        <Typography
          sx={{ fontSize: 24, textTransform: "uppercase" }}
          color="primary"
        >
          Emergency Hotline
        </Typography>
      </GridDX>
      <GridDX item xs={12} justifyContent="center" alignItems="center">
        <Typography
          style={{ fontSize: 20, fontWeight: "bold" }}
          color="primary"
        >
          South:
        </Typography>
        {makeCallLink("0301-8243495")}
      </GridDX>
      <GridDX item xs={12} justifyContent="center" sx={{ mb: 1 }}>
        <Typography
          style={{ fontSize: 20, fontWeight: "bold" }}
          color="primary"
        >
          Central:
        </Typography>
        {makeCallLink("0302-8223385")}
      </GridDX>
      <GridDX item xs={12} justifyContent="center" sx={{ mb: 1 }}>
        <Typography
          style={{ fontSize: 20, fontWeight: "bold" }}
          color="primary"
        >
          North:
        </Typography>
        {makeCallLink("0301-8223385")}
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <img src={PakQatarLogo} alt="Pak Qatar Logo" height={162} />
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <ButtonDX
          fullWidth
          onClick={() => navigate("/signin")}
          sx={{ alignItems: "flex-end", mt: 2, mb: 1 }}
        >
          Sign In
        </ButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default Hotline;
