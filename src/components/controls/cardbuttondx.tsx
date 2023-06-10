import { Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const CardButtonDX = (props: any) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: 90,
        width: 90,
        mr: 1,
        my: 1,
        p: 1,
        backgroundColor: "white",
        borderColor: theme.palette.primary.main,
        borderRadius: "12px",
        color: theme.palette.primary.main,
        cursor: "pointer",
        ...props.style,
      }}
      onClick={() => (props.onClick ? props.onClick() : navigate(props.link))}
    >
      {props.icon ?? null}
      <br />
      <Typography sx={{ textAlign: "center", fontSize: 12 }}>
        {props.label ?? ""}
      </Typography>
    </Paper>
  );
};

export default CardButtonDX;
