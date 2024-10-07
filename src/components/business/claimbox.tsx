import Typography from "@mui/material/Typography";
import Skeleton from "react-loading-skeleton";
import BoxDX from "../layout/boxdx";

const ClaimBox = (props: any) => {
  const loading = props.loading ?? false;

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else
    return (
      <BoxDX
        sx={{
          background: "rgba(139, 0, 55, 0.4)",
          boxShadow:
            "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          width: "100%",
          height: "auto",
          color: "white",
          p: 1,
          overflow: "auto",
        }}
      >
        <Typography sx={{ fontSize: 14, textAlign: "center" }}>
          {props.title}
        </Typography>
        <Typography sx={{ fontSize: 48, textAlign: "center" }}>
          {Intl.NumberFormat("en", {
            notation: "compact",
          }).format(props.value)}
        </Typography>
      </BoxDX>
    );
};

export default ClaimBox;
