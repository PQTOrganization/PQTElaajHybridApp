import { useEffect, useState } from "react";
import {
  Typography,
  CardContent,
  useTheme,
  Dialog,
  IconButton,
} from "@mui/material";
import moment from "moment";

import InReviewIcon from "@mui/icons-material/RemoveRedEye";
import RejectedIcon from "@mui/icons-material/Close";
import MemberAvatar from "@mui/icons-material/AccountCircle";
import GoBackIcon from "@mui/icons-material/ArrowBack";
import approvedIcon from "../../assets/icons/approvedIcon.png";
import Elaaj_App_Screen from "../../assets/Elaaj_App_Screen.jpg";
import pak_qatar_semi_circle_logo_2 from "../../assets/pak_qatar_semi_circle_logo_2.png";

import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";
import { formattedNumber, readableFileSize } from "../../shared/globals";
import DocumentAttachDX from "../controls/documentattachdx";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import { getDocumentTypes } from "../../shared/services/claimservice";
import LoadingButtonDX from "../controls/loadingbuttondx";
import { uploadDocument } from "../../shared/services/claimdocumentservice";
import { useConfigContext } from "../../context/configcontext";

const ClaimCard = (props: any) => {
  const theme = useTheme();
  const claimData = props.data;
  const [show, setShow] = useState(false);

  const statusColor = () => {
    switch (claimData.statusDescription) {
      case "Full Settlement":
        return theme.palette.success.main;

      case "Rejected":
        return theme.palette.error.main;

      default:
        return "#FF7A00";
    }
  };

  const statusIcon = () => {
    switch (claimData.statusDescription) {
      case "Full Settlement":
        return <img src={approvedIcon} width={21} height={21}></img>;

      case "Rejected":
        return <RejectedIcon />;

      default:
        return <InReviewIcon />;
    }
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={0}>
      <CardDialogue
        show={show}
        setShow={setShow}
        claimData={claimData}
        statusColor={statusColor}
        statusIcon={statusIcon}
      />

      <CardDX
        sx={{
          width: "100%",
          my: 1,
          cursor: "pointer",
          borderColor: statusColor(),
        }}
        onClick={() => setShow(true)}
      >
        <CardContent>
          <GridDX container sx={{ width: "100%", alignItems: "center" }}>
            <GridDX item xs={8}>
              <Typography sx={{ fontWeight: 700, color: statusColor() }}>
                {claimData.claimReceivedDate}
              </Typography>
            </GridDX>
            <GridDX
              item
              xs={4}
              alignItems="center"
              justifyContent="space-between"
              sx={{ color: statusColor() }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 500,

                  textTransform: "uppercase",
                }}
              >
                {claimData.statusDescription}
              </Typography>
              {statusIcon()}
            </GridDX>
            <GridDX item xs={12}>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                Claim# {claimData?.claimNumber}
              </Typography>
            </GridDX>
            <GridDX item xs={9} sx={{ flexDirection: "column", py: 0 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  Claim Amount:
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, ml: 1 }}
                  color={theme.palette.success.main}
                >
                  {formattedNumber(claimData?.claimAmount)}
                </Typography>
              </div>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                Paid Amount: {formattedNumber(claimData?.paidAmount)}
              </Typography>
            </GridDX>
            <GridDX item xs={3} justifyContent="center" alignItems="center">
              <MemberAvatar fontSize="large" />
            </GridDX>
          </GridDX>
        </CardContent>
      </CardDX>
    </GridDX>
  );
};

export default ClaimCard;

const CardDialogue = (props: any) => {
  const { getToken } = useAuthContext();
  const { setInfo, setError } = useErrorContext();
  const { CUMULATIVE_DOC_SIZE } = useConfigContext();

  const [isDesktop, setIsDesktop] = useState<any>(window.innerWidth > 768);
  const [documentTypes, setDocumentTypes] = useState<any>([]);
  const [docs, setDocs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [sendingRequest, setSendingRequest] = useState(false);
  const [totalSize, setTotalSize] = useState("0");

  useEffect(() => {
    const token = getToken();
    Promise.all([
      getDocumentTypes(token).then((response) => {
        setDocumentTypes(response);
      }),
    ])
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let totalSize = calculateCumulativeSize();
    setTotalSize(readableFileSize(totalSize));
  }, [docs]);

  const calculateCumulativeSize = () => {
    let cumSize = 0;
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      cumSize += element.size;
    }
    console.log("cum size", cumSize);
    return cumSize;
  };

  const addDocument = async (newDocument: any) => {
    const currentList: any[] = [...docs];
    currentList.push(newDocument);
    setDocs(currentList);
  };

  const removeDocument = async (docKey: string) => {
    const newDocs = docs.filter((d: any) => d.key !== docKey);
    setDocs(newDocs);
  };

  const handleClose = () => {
    setDocs([]);
    props.setShow(false);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (docs.length === 0)
      newErrors["documents"] = "Atleast one document must be attached.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSendingRequest(true);
      let docList = [];

      for (let index = 0; index < docs.length; index++) {
        const element = docs[index];

        docList.push({
          claimRequestId: props.claimData.claimRequestID,
          claimtDocumentTypeId: element.docType,
          document: element.document,
        });
      }

      const token = getToken();

      uploadDocument(docList, token)
        .then((response) => {
          console.log("Response", response);
          setInfo("Claim details submitted successfully");
          handleClose();
        })
        .catch((error) => {
          setError(error);
          console.log("error", error);
        })
        .finally(() => setSendingRequest(false));
    }
  };

  const claimData = props.claimData;

  return (
    <Dialog
      fullScreen
      open={props.show}
      onClose={() => handleClose()}
      PaperProps={{
        sx: {
          backgroundImage: isDesktop
            ? `url(${pak_qatar_semi_circle_logo_2})`
            : `url(${Elaaj_App_Screen})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <GridDX container>
        <GridDX item xs={1}>
          <IconButton size="large" onClick={() => handleClose()}>
            <GoBackIcon />
          </IconButton>
        </GridDX>
        <GridDX item xs={11} justifyContent="center" alignItems="center">
          <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
            Claim Details
          </Typography>
        </GridDX>
        <GridDX item xs={12} sx={{ p: 2 }}>
          <GridDX
            container
            sx={{ width: "100%", alignItems: "center" }}
            rowSpacing={3}
          >
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Name:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>
                {claimData.employeeName +
                  " (" +
                  claimData.employeeRelation +
                  ")"}
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim#:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData.claimNumber}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Claim Receiving Date:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              {claimData.claimReceivedDate}
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim Status:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              {claimData.statusDescription}
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim Type:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              {claimData.claimType}
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Claim Amount:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{formattedNumber(claimData.claimAmount)}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Paid Amount:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{formattedNumber(claimData?.paidAmount)}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Provider/Hospital:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData?.hospitalName}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Payment Mode:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData?.paymentMode}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Deduction Amount:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>
                {formattedNumber(claimData?.deductionAmount)}
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>
                Deduction Reason:
              </Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>{claimData?.deductionReason}</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography sx={{ fontWeight: 700 }}>Cheque Date:</Typography>
            </GridDX>
            <GridDX item xs={6}>
              <Typography>
                {claimData.chequeDate
                  ? moment(claimData.chequeDate).format("DD-MMM-YYYY")
                  : ""}
              </Typography>
            </GridDX>

            {claimData.statusDescription === "Pending" && (
              <>
                <GridDX xs={6}>Attach Document(s)</GridDX>
                <GridDX xs={6} justifyContent="right">
                  <Typography
                    sx={{
                      color: "#8B0037",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    {totalSize + "/" + CUMULATIVE_DOC_SIZE + " MB"}{" "}
                  </Typography>
                </GridDX>
                <GridDX xs={12}>
                  {errors["documents"] && (
                    <Typography
                      color="error"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        flex: 1,
                      }}
                    >
                      {errors["documents"]}
                    </Typography>
                  )}
                </GridDX>
                {documentTypes.map((item: any, index: number) => {
                  return (
                    <DocumentAttachDX
                      id={index + 1}
                      key={`da_${index + 1}`}
                      name={item.documentTypeName}
                      type={item.claimDocumentTypeId}
                      onDocumentAdd={addDocument}
                      onDocumentRemove={removeDocument}
                      loading={loading}
                    />
                  );
                })}
                <GridDX item xs={12} justifyContent="center">
                  <LoadingButtonDX
                    color="success"
                    onClick={handleSubmit}
                    loading={loading || sendingRequest}
                  >
                    Submit Documents
                  </LoadingButtonDX>
                </GridDX>
              </>
            )}
          </GridDX>
        </GridDX>
      </GridDX>
    </Dialog>
  );
};
