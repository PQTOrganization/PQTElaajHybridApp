import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  DialogTitle,
  Typography,
  SlideProps,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SubmitAlert = (props: any) => {
  const { open, handleClose, handleCloseOk } = props;

  const closeLabel = props.closeLabel ?? "Close";
  const okLabel = props.okLabel ?? "OK";

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted>
      <DialogTitle>{props.title ?? ""}</DialogTitle>
      <DialogContent>
        <Typography>
          Please proceed following mentioned steps before submitting an account
          opening application. Incomplete steps are:
        </Typography>
        <Typography style={{ whiteSpace: "pre" }}>
          {props.stepsDetail}
        </Typography>
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

export default SubmitAlert;
