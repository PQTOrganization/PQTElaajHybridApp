import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    readonly: {
      marginTop: 10,
      marginBottom: 10,
      "& .MuiInput-underline:before": {
        border: 0,
      },
      "& .MuiInput-underline:after": {
        border: 0,
      },
      "& .MuiInput-input": {
        opacity: 1,
        color: "black",
        fontSize: 14,
        backgroundColor: "#efefef",
        "-webkit-text-fill-color": "black", //import for mui-5
      },
      "& .MuiFormLabel-filled": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
      },
      "& .MuiInputLabel-shrink": {
        transform: "translate(0, calc(-75% + 6px)) scale(0.75)",
      },
    },
    selectStyle: {
      "& .MuiInputLabel-root": {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "80%",
        height: "100%",
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(14px, calc(-75% + 6px)) scale(0.75)",
        whiteSpace: "normal",
        maxWidth: "109%",
        height: "auto",
      },
    },
  })
);
