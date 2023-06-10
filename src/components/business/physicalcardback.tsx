import { useState } from "react";
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import CardBack from "../../assets/sample_card_back.png";
import ZoomIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

import GridDX from "../layout/griddx";

const PhysicalCardBack = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <GridDX container sx={{ width: "100%" }}>
      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogContent sx={{ p: 1, display: "flex" }}>
          <GridDX
            container
            sx={{ width: "100%", flexDirection: "column" }}
            alignContent="flex-start"
          >
            <GridDX item xs={12} justifyContent="center">
              <IconButton size="large" onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </GridDX>
            <GridDX
              item
              xs={12}
              sx={{ width: "auto", flex: 1 }}
              alignItems="flex-start"
            >
              <img
                src={CardBack}
                alt="Card Back"
                style={{ overflow: "auto" }}
              />
            </GridDX>
          </GridDX>
        </DialogContent>
      </Dialog>
      <GridDX item xs={12} sx={{ position: "relative" }}>
        <img src={CardBack} alt="Card Back" style={{ overflow: "auto" }} />
        <IconButton
          size="large"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            p: 0,
            backgroundColor: theme.palette.success.main,
          }}
          onClick={() => setOpen(true)}
        >
          <ZoomIcon fontSize="large" sx={{ color: "white" }} />
        </IconButton>
      </GridDX>
    </GridDX>
  );
};

export default PhysicalCardBack;
