import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  DialogTitle,
  SlideProps,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    marginBottom: 5,
  },
}));

const AlertComponenet = (props: any) => {
  const classes = styles();
  const { open, alert, handleClose, handleCloseOk, handlePopupClose } = props;

  const closeLabel = props.closeLabel ?? "Close";
  const okLabel = props.okLabel ?? "OK";

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{props.title ?? ""}</DialogTitle>
      <DialogContent>
        <DialogContentText>{alert}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          style={handleCloseOk ? { backgroundColor: "gray" } : {}}
        >
          {closeLabel}
        </Button>
        {handleCloseOk && (
          <Button onClick={handleCloseOk} variant="contained" color="primary">
            {okLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertComponenet;
