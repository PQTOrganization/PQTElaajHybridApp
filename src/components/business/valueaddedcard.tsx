import { Typography, CardContent, Avatar } from "@mui/material";

import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";
import ButtonDX from "../../components/controls/buttondx";
import { openURLInBrowser } from "../../shared/globals";

const ValueAddedCard = (props: any) => {
  const data = props.data ?? "";

  return (
    <CardDX sx={{ width: "100%", my: 1 }}>
      <CardContent>
        <GridDX container sx={{ width: "100%", alignItems: "center" }}>
          <GridDX item xs={8}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#007A48",
                lineHeight: "1",
              }}
            >
              {data.serviceHeading}
              <br />
              <span style={{ fontSize: "14px", color: "#7C1516" }}>
                {props.offer}
              </span>
            </Typography>
          </GridDX>
          <GridDX item xs={4} flexDirection="row-reverse">
            <Avatar
              src={data.serviceLogoFilename}
              alt="icon"
              sx={{
                borderRadius: "0%",
                width: "80px",
                height: "51px",
                "& .MuiAvatar-img": { objectFit: "contain" },
              }}
            />
          </GridDX>
          <GridDX item xs={12}>
            <Typography sx={{ fontSize: "12px", fontWeight: 400 }}>
              {data.serviceText}
              <br />
              <br />
              <span style={{ fontSize: "12px" }}>{data.serviceName}</span>
            </Typography>
          </GridDX>
          {data.serviceURL && (
            <GridDX item xs={12} justifyContent="center">
              <ButtonDX
                color="success"
                sx={{ width: "70%" }}
                onClick={() => openURLInBrowser(data.serviceURL)}
              >
                Get More Details
              </ButtonDX>
            </GridDX>
          )}
        </GridDX>
      </CardContent>
    </CardDX>
  );
};

export default ValueAddedCard;
