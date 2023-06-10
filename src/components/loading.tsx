import React, { useState, useEffect } from "react";
import { Container, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        zIndex: 200,
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default Loading;
