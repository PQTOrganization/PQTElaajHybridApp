import { Grid, Typography, useTheme } from "@mui/material";

import GridDX from "../layout/griddx";
import { formattedNumber } from "../../shared/globals";

const CoverageTable = (props: any) => {
  const rows = props.data ?? [];
  const loading = props.loading ?? false;
  const theme = useTheme();

  return (
    <GridDX container>
      <GridDX item xs={12}>
        <Typography variant="h6" color="primary">
          Coverage Detail
        </Typography>
      </GridDX>
      <Grid
        item
        xs={12}
        sx={{
          width: "100vw",
          height: 0,
          border: `1px solid black`,
        }}
      ></Grid>

      <GridDX item xs={3}>
        <Typography
          variant="caption"
          fontWeight="bold"
          fontStyle="GillSansMTPro"
        >
          Benefit(s)
        </Typography>
      </GridDX>
      <GridDX item xs={2} justifyContent="right">
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ fontStyle: "GillSansMTPro", whiteSpace: "nowrap" }}
        >
          Room Limit
        </Typography>
      </GridDX>
      <GridDX item xs={3} justifyContent="right">
        <Typography
          variant="caption"
          fontWeight="bold"
          fontStyle="GillSansMTPro"
        >
          Total Limit
        </Typography>
      </GridDX>
      <GridDX item xs={4} justifyContent="right">
        <Typography
          variant="caption"
          fontWeight="bold"
          fontStyle="GillSansMTPro"
        >
          Remaining Limit
        </Typography>
      </GridDX>

      {rows?.map((item: any, index: number) => (
        <>
          <GridDX item xs={3}>
            <Typography
              variant="caption"
              fontWeight="bold"
              fontStyle="GillSansMTPro"
            >
              {item?.coverageDescription}
            </Typography>
          </GridDX>
          <GridDX item xs={2} justifyContent="right">
            <Typography
              variant="caption"
              fontWeight="bold"
              fontStyle="GillSansMTPro"
            >
              {formattedNumber(item?.roomLimit)}
            </Typography>
          </GridDX>
          <GridDX item xs={3} justifyContent="right">
            <Typography
              variant="caption"
              fontWeight="bold"
              fontStyle="GillSansMTPro"
            >
              {formattedNumber(item?.totalAmount)}
            </Typography>
          </GridDX>
          <GridDX item xs={4} justifyContent="right">
            <Typography
              variant="caption"
              fontWeight="bold"
              fontStyle="GillSansMTPro"
            >
              {formattedNumber(item?.claimAmount)}
            </Typography>
          </GridDX>
        </>
      ))}
    </GridDX>
  );
};

export default CoverageTable;
