import { useState, useEffect } from "react";
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
  formattedNumber,
  readableFileSize,
  resizeFile,
  toBase64,
} from "../../shared/globals";
import { useConfigContext } from "../../context/configcontext";

const DocumentAttachDX = (props: any) => {
  const { setError } = useErrorContext();
  const { DOC_SIZE, IMAGE_SIZE } = useConfigContext();

  const [showDoc, setShowDoc] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState<any>([]);
  const [documentToView, setDocumentToView] = useState<any>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

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

  const reduceImageSizeToLimit = (originalImage: any, sizeInMB: any) => {
    return new Promise((resolve, reject) => {
      const percentInc = calculatePercentIncrease(sizeInMB);

      var image = new Image();
      image.src = originalImage;
      image.onload = () => {
        const oc = document.createElement("canvas");
        const octx = oc.getContext("2d");

        oc.width = image.width * (1 - percentInc);
        oc.height = image.height * (1 - percentInc);

        // step 2, resize to size
        octx?.drawImage(image, 0, 0, oc.width, oc.height);

        const newImage = oc.toDataURL();
        const newSizeInMB = getBase64ImageSizeInMB(newImage);
        console.log({ newSizeInMB });

        return resolve(newImage);
      };
      image.onerror = (error) => reject(error);
    });
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

          let newDocumentData = {
            key: props.name + moment().unix(),
            docType: props.type,
            documentName: newDocument.name,
            document: docBase64,
            size: 0,
            readableSize: "0 mb",
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

              const reducedImage = await resizeFile(newDocument);
              const newsizeInBytes = getBase64ImageSizeInBytes(reducedImage);
              let newSize = readableFileSize(newsizeInBytes);
              console.log("new size", newSize);
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
          id={props.id}
          name={props.id.toString()}
          accept="image/*,.pdf"
          type="file"
          style={{ display: "none" }}
          onChange={(e: any) => {
            onHandleDocumentUpload(props.id, e.target.files[0]);
          }}
        />
        <label htmlFor={props.id}>
          <ButtonDX component="span">Add Document</ButtonDX>
        </label>
      </GridDX>
      <GridDX item xs={12} sx={{ py: 1 }}>
        <Divider sx={{ flex: 1 }} />
      </GridDX>
    </GridDX>
  );
};

export default DocumentAttachDX;
