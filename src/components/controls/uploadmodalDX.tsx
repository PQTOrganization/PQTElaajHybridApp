import { useEffect, useRef, useState } from "react";
import { Avatar, Modal } from "@mui/material";
import ButtonDX from "./buttondx";
import { toBase64 } from "../../shared/globals";
import GridDX from "../layout/griddx";
import Box from "@mui/material/Box";
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
const UploadModalDX = (props: any) => {
  const [img, setImg] = useState<any>(null);
  const [fileName, setFileName] = useState<String>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const onChangeHandler = async (event: any) => {
    const image = await toBase64(event.target.files[0]);
    setImg(image);
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
              text={"Upload"}
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
export default UploadModalDX;
