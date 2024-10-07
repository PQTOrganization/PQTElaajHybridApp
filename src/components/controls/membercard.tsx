import { Typography } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import GridDX from "../layout/griddx";
import LoadingTypography from "./loadingtypography";

const MemberCard = (props: any) => {
  const loading = props.loading ?? false;
  const member = props.member;

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else
    return (
      <GridDX container rowSpacing={2} sx={{ width: "100%" }}>
        <GridDX item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Age:</Typography>
        </GridDX>
        <GridDX item xs={8} justifyContent="end">
          <LoadingTypography loading={loading} text={member?.age} />
        </GridDX>
        <GridDX item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            Employee Code:
          </Typography>
        </GridDX>
        <GridDX item xs={8} justifyContent="end">
          <LoadingTypography loading={loading} text={member?.employeeFolioId} />
        </GridDX>
        <GridDX item xs={4}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            Certificate #:
          </Typography>
        </GridDX>
        <GridDX item xs={8} justifyContent="end">
          <LoadingTypography
            loading={loading}
            text={member?.employeeSRNumber}
          />
        </GridDX>
      </GridDX>
    );
};

export default MemberCard;
