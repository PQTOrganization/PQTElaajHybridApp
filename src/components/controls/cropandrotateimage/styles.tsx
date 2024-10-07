import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const cropperStyles = makeStyles((theme: Theme) => ({
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 100,
    background: "white",
    [theme.breakpoints.up("sm")]: {
      height: 200,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
  },
  controls: {
    // padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  sliderLabel: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: "22px 0px",
    marginLeft: 16,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
      margin: "0 16px",
    },
  },
}));
