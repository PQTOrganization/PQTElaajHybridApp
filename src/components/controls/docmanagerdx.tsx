import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";

import GoBackIcon from "@mui/icons-material/ArrowBack";

import BoxDX from "../layout/boxdx";
import GridDX from "../layout/griddx";
import ButtonDX from "./buttondx";

import { useErrorContext } from "../../context/errorcontext";

import { toBase64 } from "../../shared/globals";
import { useConfigContext } from "../../context/configcontext";

const DocManagerDX = forwardRef((props: any, ref: any) => {
  const { setError } = useErrorContext();
  const { DOC_SIZE, MIN_DOCS, MAX_DOCS } = useConfigContext();

  useImperativeHandle(ref, () => ({
    documentList() {
      return docs;
    },
  }));

  const [docs, setDocs] = useState<any>([]);
  const [showDoc, setShowDoc] = useState(false);
  const [viewDocumentIndex, setViewDocumentIndex] = useState(-1);
  const [documentToView, setDocumentToView] = useState<any>(null);

  const onDocumentUploaded = (file: File) => {
    if (file.size / (1024 * 1024) > DOC_SIZE) {
      setError("The Uploaded file Size is more than " + DOC_SIZE + " MB");
      return;
    }

    const newDocs = docs.slice();
    newDocs.push(file);
    setDocs(newDocs);
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const removeDoc = (docIndex: number) => {
    const newDocs = docs.slice();
    newDocs.splice(docIndex, 1);
    setDocs(newDocs);
  };

  const viewDocument = async (documentIndex: number) => {
    const image = await toBase64(docs[documentIndex]);
    setDocumentToView(image);
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

  return (
    <GridDX container sx={{ width: "100%" }}>
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
      <GridDX item xs={12} sx={{ flexDirection: "column" }}>
        <Typography sx={{ fontWeight: 400, fontSize: 12 }}>
          Attach Document(s)
        </Typography>
        <Typography sx={{ fontWeight: 400, fontSize: 12 }}>
          Minimum {MIN_DOCS} & Maximum {MAX_DOCS} Documents can be added
        </Typography>
      </GridDX>
      <GridDX item xs={12} sx={{ flexDirection: "column" }}>
        {docs.map((d: any, index: number) => (
          <GridDX
            key={"key_dm_" + index}
            container
            sx={{ width: "100%" }}
            rowSpacing={0}
            alignItems="center"
          >
            <GridDX item xs={8}>
              <Typography sx={{ fontSize: 14 }}>
                {index + 1 + ". " + d.name}
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
                onClick={() => removeDoc(index)}
              >
                Delete
              </ButtonDX>
            </GridDX>
          </GridDX>
        ))}
      </GridDX>
      <GridDX item xs={12}>
        {docs.length < MIN_DOCS && (
          <BoxDX>
            <input
              id="uploadDoc"
              name="uploadDoc"
              accept="image/*,.pdf"
              type="file"
              style={{ display: "none" }}
              onChange={(e: any) => {
                onDocumentUploaded(e.target.files[0]);
              }}
            />
            <label htmlFor="uploadDoc">
              <ButtonDX variant="text" size="small" component="span">
                Add Document
              </ButtonDX>
            </label>
          </BoxDX>
        )}
      </GridDX>
    </GridDX>
  );
});

export default DocManagerDX;
