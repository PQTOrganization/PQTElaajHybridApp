import { Typography } from "@mui/material";
import React, { useState } from "react";
import GridDX from "../../components/layout/griddx";
import TextFieldDX from "../../components/controls/textfielddx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onRegisterClick = () => {
    navigate("/verification");
  };
  return (
    <>
      <GridDX container>
        <GridDX item xs={12} justifyContent="center">
          <Typography color="primary" variant="h4" fontWeight="bold">
            Registration
          </Typography>
        </GridDX>
        <GridDX
          item
          xs={12}
          justifyContent="center"
          sx={{ mt: 2, mb: 1, pl: "8%", pr: "8%" }}
        >
          <TextFieldDX
            name="policyNumber"
            label={"Enter Policy Number"}
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
        <GridDX
          item
          xs={12}
          justifyContent="center"
          sx={{ pl: "8%", pr: "8%" }}
        >
          <TextFieldDX
            name="cnic"
            type="number"
            label="Enter CNIC Number"
            variant="standard"
            sx={{
              borderBottom: "1px solid #8B0037",
            }}
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
        <GridDX
          item
          xs={12}
          justifyContent="center"
          sx={{ pl: "8%", pr: "8%" }}
        >
          <TextFieldDX
            name="dob"
            type="number"
            label="Enter Date of Birth"
            variant="standard"
            sx={{
              borderBottom: "1px solid #8B0037",
            }}
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
        <GridDX
          item
          xs={12}
          justifyContent="center"
          sx={{ pl: "8%", pr: "8%" }}
        >
          <TextFieldDX
            name="cellNo"
            type="number"
            label="Cell No"
            variant="standard"
            sx={{
              borderBottom: "1px solid #8B0037",
            }}
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
        <GridDX
          item
          xs={12}
          justifyContent="center"
          sx={{ pl: "8%", pr: "8%" }}
        >
          <TextFieldDX
            name="email"
            type="text"
            label="Email"
            variant="standard"
            sx={{
              borderBottom: "1px solid #8B0037",
            }}
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
            onClick={onRegisterClick}
            loading={isLoading}
            sx={{
              mt: 3,
              backgroundColor: "green !important",
              width: "190px",
              borderRadius: "50px",
            }}
          >
            Submit
          </LoadingButtonDX>
        </GridDX>
      </GridDX>
    </>
  );
}

export default Registration;
