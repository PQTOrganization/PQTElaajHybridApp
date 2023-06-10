import { Unstable_Grid2 } from "@mui/material";

const GridDX = (props: any) => {
  return (
    <Unstable_Grid2 {...props} style={{ display: "flex", ...props.sx }}>
      {props.children}
    </Unstable_Grid2>
  );
};

export default GridDX;
