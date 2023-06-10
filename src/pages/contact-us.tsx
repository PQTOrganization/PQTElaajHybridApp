import { Typography } from "@mui/material";

import GridDX from "../components/layout/griddx";
import ButtonDX from "../components/controls/buttondx";

import { handleCall } from "../shared/globals";

const ContactUs = () => {
  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start" }}
      rowSpacing={2}
    >
      <GridDX item xs={12}>
        <h1
          style={{
            fontWeight: "400",
            fontSize: "34px",
            lineHeight: "36px",
          }}
        >
          PAK-QATAR TAKAFUL
        </h1>
      </GridDX>
      <GridDX item xs={12}>
        <Typography
          sx={{ fontWeight: 500, fontSize: "20px", lineHeight: "21px" }}
        >
          Pre-Authorization & Claim Payment Contact Details
        </Typography>
      </GridDX>
      <GridDX item xs={12} flexDirection="column">
        <Typography>Customer Services</Typography>
        <Typography>UAN #: 021-111-825-238</Typography>
      </GridDX>

      <GridDX item xs={12} flexDirection="column">
        <Typography>North:&nbsp;&nbsp;&nbsp;051 2804133-5</Typography>
        <Typography>Central:&nbsp;042 35817202-4</Typography>
        <Typography>South:&nbsp;&nbsp;&nbsp;021 34311747</Typography>
        <Typography>Fax No:&nbsp;02134386451</Typography>
      </GridDX>
      <GridDX item xs={12}></GridDX>
      <GridDX item xs={12} flexDirection="column">
        <Typography
          sx={{ fontWeight: 500, fontSize: "14px", lineHeight: "24px" }}
        >
          Please send emails to the following addresses
        </Typography>
        <Typography sx={{ fontSize: "14px" }}>
          Queries/Approvals regarding Pre-Authorization requests:
          <br />
          approvals@pakqatar.com.pk
        </Typography>
      </GridDX>
      <GridDX item xs={12}>
        <Typography sx={{ fontSize: "14px" }}>
          Queries regarding Claim Reimbursement:
          <br />
          claim.pqft@pakqatar.com.pk
        </Typography>
      </GridDX>
      <GridDX item xs={12}></GridDX>
      <GridDX item xs={12}></GridDX>
      <GridDX item xs={12} sx={{ justifyContent: "center" }}>
        <ButtonDX sx={{ width: "50%" }} onClick={handleCall}>
          Call Now
        </ButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default ContactUs;
