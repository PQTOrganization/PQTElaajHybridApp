import React, { useEffect } from "react";
import GridDX from "./griddx";
import { Typography, useTheme } from "@mui/material";

function Table(props: any) {
  const { data } = props;
  const theme = useTheme();

  return (
    <GridDX container width= "100%" >
      <GridDX item xs={12}>
        <Typography variant="h6" color="primary">
          Covered Dependents
        </Typography>
      </GridDX>
      <GridDX
        item
        xs={12}
        sx={{
          width: "100%",
          height: 0,
          border: `1px solid black`,
        }}
      ></GridDX>

      <GridDX item xs={3}>
        <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">Name</Typography>
      </GridDX>
      <GridDX item xs={2} justifyContent="right">
        <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">Relation</Typography>
      </GridDX>
      <GridDX item xs={3} justifyContent="right">
        <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">Age</Typography>
      </GridDX>
      <GridDX item xs={4} justifyContent="right">
        <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">Cert No</Typography>
      </GridDX>

      {data?.map((item: any, index: number) => (
        <React.Fragment key={index}>
          <GridDX item xs={3}>
            <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">{item?.employeeName}</Typography>
          </GridDX>
          <GridDX item xs={2} justifyContent="right">
            <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">{item?.relation}</Typography>
          </GridDX>
          <GridDX item xs={3} justifyContent="right">
            <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">{item?.age}</Typography>
          </GridDX>
          <GridDX item xs={4} justifyContent="right">
            <Typography variant="caption" fontWeight="bold" fontStyle="GillSansMTPro">{item?.policyNumber}</Typography>
          </GridDX>
        </React.Fragment>
      ))}
    </GridDX>
  );
}

export default Table;
