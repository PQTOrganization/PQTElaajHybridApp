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

import { useErrorContext } from "../../context/errorcontext";

import { DOC_SIZE, toBase64 } from "../../shared/globals";

const DocumentAttachDX = (props: any) => {
  const { setError } = useErrorContext();

  const [showDoc, setShowDoc] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState<any>([]);
  const [documentToView, setDocumentToView] = useState<any>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const onHandleDocumentUpload = async (docId: any, newDocument: any) => {
    if (newDocument instanceof File) {
      try {
        if (
          newDocument.type.includes("image") ||
          newDocument.type.includes("pdf")
        ) {
          if (newDocument.size / (1024 * 1024) > DOC_SIZE) {
            setError("The Uploaded file Size is more than " + DOC_SIZE + " MB");
            return;
          }

          const docBase64 = await toBase64(newDocument);
          const newDocumentData = {
            key: props.name + moment().unix(),
            docType: props.type,
            documentName: newDocument.name,
            document: docBase64,
          };

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
            <GridDX item xs={8}>
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
            <GridDX item xs={2}>
              <ButtonDX
                variant="text"
                size="small"
                onClick={() => viewDocument(index)}
              >
                View
              </ButtonDX>
            </GridDX>
            <GridDX item xs={2}>
              <ButtonDX
                variant="text"
                size="small"
                onClick={() => removeDocument(d.key)}
              >
                Delete
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
