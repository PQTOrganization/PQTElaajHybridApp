import { useEffect, useRef, useState } from "react";
import { Avatar, Modal, Slider, Typography } from "@mui/material";
import ButtonDX from "../buttondx";
import { toBase64 } from "../../../shared/globals";
import GridDX from "../../layout/griddx";
import Box from "@mui/material/Box";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./canvasUtil";
import React from "react";
import { cropperStyles } from "./styles";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CropperImageDX = (props: any) => {
  const classes = cropperStyles();

  const [img, setImg] = useState<any>(null);
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [fileName, setFileName] = useState<String>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState<any>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const inputRef = useRef<HTMLDivElement>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImg,
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      setImg(croppedImage);
      setSelectedImg(null);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeHandler = async (event: any) => {
    const image = await toBase64(event.target.files[0]);
    setSelectedImg(image);
    setFileName(event.target.files[0].name);
  };

  const processImage = async () => {
    setLoading(true);
    await props.UploadFile(img, fileName);
    setLoading(false);
    props.setshow(!props.show);
    setImg(null);
  };

  const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  const openDialog = (event: any) => {
    if (inputRef.current != null && event.detail == "profile") {
      inputRef.current.click();
    }
  };

  useEffect(() => {
    document.addEventListener("UploadAction", openDialog);
    return () => {
      document.addEventListener("UploadAction", openDialog);
    };
  });

  return (
    <Modal
      open={props.show}
      onClose={props.setshow}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {img ? (
          <GridDX item xs={12} justifyContent="center">
            <Avatar
              id={"Contained"}
              style={{
                height: "200px",
                width: "200px",
                display: "flex",
                margin: "5%",
                fontSize: "25px",
              }}
              src={img ? img : ""}
            />
          </GridDX>
        ) : (
          ""
        )}

        {selectedImg && (
          <React.Fragment>
            <div className={classes.cropContainer}>
              <Cropper
                image={selectedImg}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className={classes.controls}>
              <div className={classes.sliderContainer}>
                <Typography
                  variant="overline"
                  classes={{ root: classes.sliderLabel }}
                  sx={{ marginRight: "26px" }}
                >
                  Zoom
                </Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  classes={{ root: classes.slider }}
                  onChange={(e, zoom) => setZoom(zoom)}
                />
              </div>
            </div>
            <div className={classes.controls}>
              <div className={classes.sliderContainer}>
                <Typography
                  variant="overline"
                  classes={{ root: classes.sliderLabel }}
                >
                  Rotation
                </Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  classes={{ root: classes.slider }}
                  onChange={(e, rotation: any) => setRotation(rotation)}
                />
              </div>
            </div>
            <div className={classes.cropButton}>
              <ButtonDX
                onClick={showCroppedImage}
                variant="contained"
                color="primary"
              >
                Done
              </ButtonDX>
            </div>
          </React.Fragment>
        )}
        {img === null && selectedImg === null && (
          <>
            <GridDX item xs={12} justifyContent="center">
              <input
                accept="image/*"
                type="file"
                name="file"
                style={{
                  width: "80%",
                  padding: "20px",
                  color: "black",
                }}
                onChange={onChangeHandler}
              />
            </GridDX>
          </>
        )}
        <GridDX item xs={12} justifyContent="center">
          {img == null ? (
            <ButtonDX
              loading={loading}
              style={{
                width: "80%",
                marginTop: "0",
                backgroundColor: "black",
                color: "white",
              }}
              text={"Upload Disabled"}
              disabled
            >
              UPLOAD
            </ButtonDX>
          ) : (
            <ButtonDX
              loading={loading}
              style={{
                width: "80%",
                marginTop: "0",
                color: "white",
                backgroundColor: "black",
              }}
              onClick={processImage}
            >
              UPLOAD
            </ButtonDX>
          )}
        </GridDX>
      </Box>
    </Modal>
  );
};

export default CropperImageDX;
