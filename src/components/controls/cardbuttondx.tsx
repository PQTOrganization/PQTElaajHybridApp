import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BoxDX from "../layout/boxdx"; // Assuming BoxDX is properly imported and used

const CardButtonDX = (props: any) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <BoxDX
        {...props}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          cursor: "pointer",

          ...props.style,
        }}
        onClick={() => (props.onClick ? props.onClick() : navigate(props.link))}
      >
        {props.icon ?? null}
      </BoxDX>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 12,
          color: theme.palette.primary.main,
          fontWeight: "bold",
          wordWrap: "break-word",
          maxWidth: 100,
        }}
      >
        {props.label ?? ""}
      </Typography>
    </div>
  );
};

export default CardButtonDX;
