import { useState, useEffect, useRef, createRef } from "react";
import {
  Divider,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";

import moment from "moment";

import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/CheckCircle";
import GoBackIcon from "@mui/icons-material/ArrowBack";

import ButtonDX from "./buttondx";
import GridDX from "../layout/griddx";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import { useErrorContext } from "../../context/errorcontext";

import {
  base64toBlob,
  bytesToMegabytes,
  formattedNumber,
  openDocumentUploadOnMobile,
  readableFileSize,
  resizeFile,
  toBase64,
} from "../../shared/globals";
import { useConfigContext } from "../../context/configcontext";

const DocumentAttachDX = (props: any) => {
  const inputFile = useRef();
  const { setError } = useErrorContext();
  const { DOC_SIZE, IMAGE_SIZE, REDUCED_IMG_MAXHEIGHT, REDUCED_IMG_MAXWIDTH } =
    useConfigContext();

  const [showDoc, setShowDoc] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState<any>([]);
  const [documentToView, setDocumentToView] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.addEventListener("message", docFromApp, false);
    window.addEventListener("message", docFromApp, false); // for IOS

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    return () => {
      document.removeEventListener("message", docFromApp, false);
      window.removeEventListener("message", docFromApp, false);
    };
  }, []);

  useEffect(() => {
    document.removeEventListener("message", docFromApp, false);
    window.removeEventListener("message", docFromApp, false);

    document.addEventListener("message", docFromApp, false);
    window.addEventListener("message", docFromApp, false); // for IOS

    return () => {
      document.removeEventListener("message", docFromApp, false);
      window.removeEventListener("message", docFromApp, false);
    };
  }, [attachedDocuments]);

  const docFromApp = async (message: any) => {
    // Ensure the message is from React Native WebView
    // if (message.origin !== "null") return; // WebViews send messages with 'null' origin

    let id = JSON.parse(message.data).id;
    let k = JSON.parse(message.data).key;
    let data = JSON.parse(message.data).data;
    let type = JSON.parse(message.data).type;
    let name = JSON.parse(message.data).name;
    let size = parseInt(JSON.parse(message.data).size);

    if (props.id === id) {
      if (type === "pdf") {
        data = "data:application/pdf;base64," + data;
      } else {
        data = "data:image/png;base64," + data;
      }

      onHandleDocumentUploadFromMobile(data, name, size, type);
    }
  };

  const calculatePercentIncrease = (sizeInMB: any) => {
    const numerator = Math.abs(sizeInMB - IMAGE_SIZE);
    const denominator = (sizeInMB + IMAGE_SIZE) / 2;
    const percent = Math.round((numerator / denominator) * 100) / 100;

    return percent;
  };

  const getBase64ImageSizeInMB = (image: any) => {
    const stringLength = image.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInMB = sizeInBytes / 1048576;
    return sizeInMB;
  };

  const getBase64ImageSizeInBytes = (image: any) => {
    const stringLength = image.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes;
  };

  const onHandleDocumentUploadFromMobile = async (
    doc: any,
    name: string,
    size: number,
    type: string
  ) => {
    let fileSize = 0,
      readableSize;

    if (type === "pdf" && size / (1024 * 1024) > DOC_SIZE) {
      setError("The Uploaded file Size is more than " + DOC_SIZE + " MB");
      return;
    }

    let newDocumentData = {
      key: props.name + moment().unix(),
      docType: props.type,
      documentName: name,
      document: doc,
      size: size,
      readableSize: readableFileSize(size),
    };

    if (type === "image") {
      fileSize = getBase64ImageSizeInBytes(doc);
      readableSize = readableFileSize(fileSize);
      let sizeInMB = bytesToMegabytes(fileSize);

      if (sizeInMB > IMAGE_SIZE) {
        try {
          console.log("The captured Image is more than " + IMAGE_SIZE + "MB");
          let docBlob = base64toBlob(doc);
          const reducedImage = await resizeFile(
            docBlob,
            REDUCED_IMG_MAXWIDTH,
            REDUCED_IMG_MAXHEIGHT
          );
          fileSize = getBase64ImageSizeInBytes(reducedImage);
          readableSize = readableFileSize(fileSize);

          newDocumentData.document = reducedImage;
          newDocumentData.size = fileSize;
          newDocumentData.readableSize = readableSize;
        } catch (err) {
          setError(err);
        }
      }
    }

    setAttachedDocuments([...attachedDocuments, newDocumentData]);
    props.onDocumentAdd(newDocumentData);
  };

  const onHandleDocumentUpload = async (docId: any, newDocument: any) => {
    if (newDocument instanceof File) {
      try {
        if (
          newDocument.type.includes("image") ||
          newDocument.type.includes("pdf")
        ) {
          if (
            newDocument.type.includes("pdf") &&
            newDocument.size / (1024 * 1024) > DOC_SIZE
          ) {
            setError("The Uploaded file Size is more than " + DOC_SIZE + " MB");
            return;
          }

          const docBase64 = await toBase64(newDocument);

          const sizeInBytes = getBase64ImageSizeInBytes(docBase64);

          let newDocumentData = {
            key: props.name + moment().unix(),
            docType: props.type,
            documentName: newDocument.name,
            document: docBase64,
            size: sizeInBytes,
            readableSize: readableFileSize(sizeInBytes),
          };

          if (newDocument.type.includes("image")) {
            const sizeInMB = getBase64ImageSizeInMB(docBase64);
            const sizeInBytes = getBase64ImageSizeInBytes(docBase64);
            newDocumentData.size = sizeInBytes;
            newDocumentData.readableSize = readableFileSize(sizeInBytes);
            if (sizeInMB > IMAGE_SIZE) {
              console.log(
                "The captured Image is more than " + IMAGE_SIZE + "MB"
              );

              const reducedImage = await resizeFile(
                newDocument,
                REDUCED_IMG_MAXWIDTH,
                REDUCED_IMG_MAXHEIGHT
              );

              const newsizeInBytes = getBase64ImageSizeInBytes(reducedImage);
              let newSize = readableFileSize(newsizeInBytes);
              newDocumentData.document = reducedImage;
              newDocumentData.size = newsizeInBytes;
              newDocumentData.readableSize = newSize;
            }
          }

          setAttachedDocuments([...attachedDocuments, newDocumentData]);
          props.onDocumentAdd(newDocumentData);
        } else {
          setError("Only image and PDF files are allowed");
          return;
        }
      } catch (err) {
        setError("Error converting file to base64", err);
        return;
      }
    }
  };

  const viewDocument = async (documentIndex: number) => {
    setDocumentToView(attachedDocuments[documentIndex].document);
    setShowDoc(true);
  };

  const renderDocument = () => {
    if (documentToView?.split(";")[0].split(":")[1] === "application/pdf")
      return (
        <Document file={`${documentToView}`}>
          <Page pageNumber={1} renderTextLayer={false} />
        </Document>
      );
    else return <img src={documentToView} style={{ width: "100%" }} />;
  };

  const removeDocument = (docKey: string) => {
    const newDocs = attachedDocuments.filter((x: any) => x.key !== docKey);
    setAttachedDocuments(newDocs);
    props.onDocumentRemove(docKey);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileAdd = () => {
    const win: any = window;
    if (win?.ReactNativeWebView) {
      openDocumentUploadOnMobile(props.id);
    } else {
      const input = document.getElementById(props.id);

      if (input) {
        input.click();
      }
      // setUploadModal(!uploadModal);
    }
  };

  return (
    <GridDX
      key={"attach_doc_" + props.id}
      container
      sx={{
        width: "100%",
        alignContent: "flex-start",
        my: 1,
      }}
      rowSpacing={1}
    >
      <Dialog fullScreen open={showDoc} onClose={() => setShowDoc(false)}>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <GridDX container sx={{ height: "100%" }} alignItems="flex-start">
            <GridDX item xs={12}>
              <IconButton size="large" onClick={() => setShowDoc(false)}>
                <GoBackIcon />
              </IconButton>
            </GridDX>
            <GridDX
              item
              xs={12}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {showDoc && documentToView && renderDocument()}
            </GridDX>
          </GridDX>
        </DialogContent>
      </Dialog>

      <GridDX item xs={1} alignItems="center">
        {attachedDocuments.length > 0 ? (
          <DoneIcon color="success" fontSize="small" />
        ) : (
          <CancelIcon color="secondary" fontSize="small" />
        )}
      </GridDX>
      <GridDX item xs={11} alignItems="center">
        <Typography>{props.name}</Typography>
      </GridDX>
      <GridDX item xs={12} sx={{ flexDirection: "column" }}>
        {attachedDocuments.map((d: any, index: number) => (
          <div
            key={`dockey_${props.name}_${index}`}
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              maxWidth: "100%", // IMPORTANT
            }}
          >
            <GridDX item xs={7}>
              <Typography
                sx={{
                  fontSize: 14,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {d.documentName}
              </Typography>
            </GridDX>
            <GridDX item xs={3} justifyContent="right">
              <Typography
                sx={{
                  fontSize: 14,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  // justifyContent: "right",
                  marginRight: 2,
                }}
              >
                {d.readableSize}
              </Typography>
            </GridDX>
            <GridDX item xs={1} justifyContent="center">
              <ButtonDX
                variant="text"
                // size="small"
                sx={{ minWidth: "40px", maxWidth: "40px" }}
                onClick={() => viewDocument(index)}
              >
                <VisibilityIcon />
              </ButtonDX>
            </GridDX>
            <GridDX item xs={1} justifyContent="center">
              <ButtonDX
                variant="text"
                sx={{ minWidth: "40px", maxWidth: "40px" }}
                onClick={() => removeDocument(d.key)}
              >
                <DeleteIcon />
              </ButtonDX>
            </GridDX>
          </div>
        ))}
      </GridDX>

      <GridDX item xs={12} justifyContent="center">
        <input
          ref={fileInputRef}
          id={props.id}
          name={props.id.toString()}
          accept="image/*,.pdf"
          type="file"
          style={{ display: "none" }}
          onChange={(e: any) => {
            onHandleDocumentUpload(props.id, e.target.files[0]);
          }}
        />
        {/* <label htmlFor={props.id}> */}
        <ButtonDX component="span" onClick={handleFileAdd}>
          Add Document
        </ButtonDX>
        {/* </label> */}
      </GridDX>
      {/* <GridDX item xs={12}>
        {attachedDocuments.length}
      </GridDX> */}
      {/* <GridDX item xs={12}>
        {stateValue}
      </GridDX> */}
      {/* <ButtonDX onClick={() => setStateValue("in porces")}>Click me</ButtonDX> */}
      <GridDX item xs={12} sx={{ py: 1 }}>
        <Divider sx={{ flex: 1 }} />
      </GridDX>
      {/* <GridDX item xs={12}>
        {attachedDocuments.length}
      </GridDX> */}
    </GridDX>
  );
};

export default DocumentAttachDX;
