import React from "react";
import GridDX from "../components/layout/griddx";
import TeleDoc_2 from "../assets/icons/TeleDoc_2.png";
import { Typography } from "@mui/material";

function TeleDoc() {
  return (
    <GridDX container>
      <GridDX item xs={12} display="flex" flexDirection="column" alignItems="center">
        <img src={TeleDoc_2} width={120} height={120}></img>
        <Typography color="primary" variant="h5" fontWeight="bold" mb={4}>
          Tele Doc
        </Typography>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <Typography color="primary" variant="body1" mb={2}>
              1. You may use Teledoc to speak with a qualified physician for all your primary healthcare queries
            </Typography>
          </li>
          <li>
            <Typography color="primary" variant="body1" mb={2}>
              2. This is a Free Call Back Service offered by Pak Qatar with an average wait time of 20 minutes
            </Typography>
          </li>
          <li>
            <Typography color="primary" variant="body1" mb={2}>
              3. This service is available from 9am to 5pm and is not recommended for emergency services
            </Typography>
          </li>
        </ul>
        <Typography color="primary" variant="h5" fontWeight="bold" mb={2}>
          111 - Takaful (825-238)
        </Typography>
      </GridDX>
    </GridDX>
  );
}

export default TeleDoc;
