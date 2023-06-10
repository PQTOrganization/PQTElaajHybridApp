import React from "react";
import { withStyles } from "@mui/styles";
import { Grid, Switch, Theme, Typography } from "@mui/material/";

const YesNoSwitch = withStyles((theme: Theme) => ({
  root: {
    width: 28,
    height: 17,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
    height: 15,
  },
  checked: {},
}))(({ classes, ...props }: any) => {
  if (props.readOnly)
    return (
      <Typography
        style={{
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: "10px",
          fontWeight: 900,
          backgroundColor: "#cdcdcd",
          borderWidth: 1,
          borderRadius: 5,
          padding: 5,
          width: 20,
          float: "right",
        }}
      >
        {props.checked ? "Yes" : "No"}
      </Typography>
    );
  else
    return (
      <Grid
        component="label"
        container
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
      >
        <Grid item>
          <Typography style={{ fontSize: "12px" }}>No</Typography>
        </Grid>
        <Grid item>
          <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
              root: classes.root,
              switchBase: classes.switchBase,
              thumb: classes.thumb,
              track: classes.track,
              checked: classes.checked,
            }}
            {...props}
          />
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: "12px" }}>Yes</Typography>
        </Grid>
      </Grid>
    );
});

export default YesNoSwitch;
