import { Typography, CardContent, useTheme } from "@mui/material";
import CardActions from "@mui/material/CardActions";

import ButtonDX from "../controls/buttondx";
import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";

const PanelHospitalCard = (props: any) => {
  const theme = useTheme();

  const hospitalData = props.data;

  const showOnMapClick = () => {
    if (hospitalData && props.showMap) props.showMap(hospitalData);
  };

  return (
    <CardDX sx={{ width: "100%", my: 1 }}>
      <CardContent sx={{ pb: 0 }}>
        <GridDX
          container
          sx={{ width: "100%", alignItems: "center" }}
          rowSpacing={1}
        >
          <GridDX item xs={9}>
            <Typography sx={{ fontWeight: 700 }} color="#FF7A00">
              {hospitalData.hospitalName}
            </Typography>
          </GridDX>
          <GridDX
            item
            xs={3}
            sx={{ flexDirection: "column" }}
            alignItems="flex-end"
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textAlign: "right",
              }}
              color="#FF7A00"
            >
              {hospitalData.city}
              <br />
              {hospitalData.distance === 99999
                ? ""
                : hospitalData.distance + " KM"}
            </Typography>
          </GridDX>
          <GridDX item xs={12}>
            <Typography
              sx={{ fontSize: 12 }}
              color={theme.palette.secondary.main}
            >
              {hospitalData?.services}
            </Typography>
          </GridDX>
          <GridDX item xs={12}>
            <Typography
              sx={{ fontSize: 12 }}
              color={theme.palette.secondary.main}
            >
              {hospitalData.hospitalAddress ?? "" + ", " + hospitalData.city}
            </Typography>
          </GridDX>
          <GridDX item xs={12}>
            <Typography
              sx={{ fontSize: 12 }}
              color={theme.palette.secondary.main}
            >
              Phone: {hospitalData?.phones}
            </Typography>
          </GridDX>
        </GridDX>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <ButtonDX
          variant="text"
          color="secondary"
          size="small"
          onClick={() => showOnMapClick()}
        >
          Click to View Map
        </ButtonDX>
      </CardActions>
    </CardDX>
  );
};

export default PanelHospitalCard;
