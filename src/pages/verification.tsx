import React, { useState } from "react";
import GridDX from "../components/layout/griddx";
import LoadingButtonDX from "../components/controls/loadingbuttondx";
import TextFieldDX from "../components/controls/textfielddx";
import ElaajLogo from "../assets/elaaj_logo.png";
import PakQatarLogo from "../assets/pak_qatar_logo_2.png";

function Verification() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {};
  return (
    <GridDX container>
      <GridDX
        item
        xs={12}
        justifyContent="center"
        sx={{
          position: "fixed",
          top: "0",
          mt: "25px",
          width: "100%",
          zindex: "1",
        }}
      >
        <img src={ElaajLogo} alt="Elaaj Logo" width={100} height={100} />
      </GridDX>

      <GridDX
        item
        xs={12}
        justifyContent="center"
        sx={{ mb: 1, pl: "8%", pr: "8%" }}
      >
        <TextFieldDX
          name="verificationCode"
          label={"Enter Verification Code"}
          type="number"
          variant="standard"
          sx={{ borderBottom: "1px solid #8B0037" }}
          InputLabelProps={{
            sx: {
              color: "#8B0037",
              textAlign: "center",
              width: "100%",
              transformOrigin: "top",
            },
          }}
        />
      </GridDX>

      <GridDX item xs={12} justifyContent="center">
        <LoadingButtonDX
          onClick={handleSubmit}
          loading={isLoading}
          sx={{
            mt: 3,
            backgroundColor: "green !important",
            width: "190px",
            borderRadius: "50px",
          }}
        >
          Enter
        </LoadingButtonDX>
      </GridDX>
      <GridDX item xs={12} justifyContent="center" sx={{ mt: "25%" }}>
        <img src={PakQatarLogo} alt="Pak Qatar Logo" height={130} />
      </GridDX>
    </GridDX>
  );
}

export default Verification;
