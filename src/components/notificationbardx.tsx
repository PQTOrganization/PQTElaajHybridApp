import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

import { useErrorContext } from "../context/errorcontext";

const NotificationBarDX = () => {
  const { error, info, setError, setInfo } = useErrorContext();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (error || info) {
      if (info) setAlertMessage(info);
      else if (error.message)
        setAlertMessage(error.message); // to show errors generate by throw
      else setAlertMessage(error);
      setShowAlert(true);
    }
  }, [error, info]);

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage("");
    setError(null);
    setInfo(null);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={showAlert}
      autoHideDuration={5000}
      onClose={handleAlertClose}
    >
      <Alert onClose={handleAlertClose} severity={error ? "error" : "info"}>
        {alertMessage ?? "Unexpected error!"}
      </Alert>
    </Snackbar>
  );
};

export default NotificationBarDX;
