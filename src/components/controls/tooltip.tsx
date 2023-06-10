import React, { useState } from "react";
import { Tooltip, ClickAwayListener, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HelpIcon from "@mui/icons-material/Help";

const useStyles = makeStyles((theme) => ({
  customWidth: {
    width: "1rem !important",
    height: "1rem !important",
  },
}));

const TooltipHelper = (props: any) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const show = props.show ?? true;

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  if (show)
    return (
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          arrow
          onClose={handleTooltipClose}
          open={open}
          title={<div style={{ textAlign: "justify" }}>{props.title}</div>}
          className={classes.customWidth}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <IconButton
            onClick={handleTooltipOpen}
            color="default"
            aria-label="upload picture"
            component="span"
            size="small"
          >
            <HelpIcon fontSize="small" style={{ ...props.style }} />
          </IconButton>
        </Tooltip>
      </ClickAwayListener>
    );
  else return null;
};

export default TooltipHelper;
