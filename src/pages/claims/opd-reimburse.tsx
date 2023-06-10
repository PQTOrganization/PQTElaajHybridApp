import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Typography } from "@mui/material";

import GridDX from "../../components/layout/griddx";
import MemberSelector from "../../components/business/memberselector";
import AutoCompleteListDX from "../../components/controls/autocompletelistdx";
import TextFieldDX from "../../components/controls/textfielddx";
import ButtonDX from "../../components/controls/buttondx";
import CheckBoxDX from "../../components/controls/checkboxdx";
import OPDGuidelines from "../../components/business/OPDGuidelines";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";
import DocumentAttachDX from "../../components/controls/documentattachdx";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import {
  createOPDClaimRequest,
  getDocumentTypes,
} from "../../shared/services/claimservice";
import { getPanelHospitalsLookup } from "../../shared/services/commonservice";
import { getMembers } from "../../shared/services/memberservice";

const OPDReimburese = () => {
  const navigate = useNavigate();
  const { getUserDetails, getToken } = useAuthContext();
  const { setInfo, setError } = useErrorContext();

  const defaultValues = {
    claimTypeId: "",
    panelHospitalId: "",
    claimAmount: null,
  };

  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState<any>({});

  //****** OPD GUIDELINE (DIALOG) CONTROLS
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //******

  const [hospitals, setHospitals] = useState([]);
  const [userDetails, setUserDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<any>([]);
  const [claimRequestId, setClaimRequestId] = useState(0);
  const [docs, setDocs] = useState<any>([]);
  const [members, setMembers] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      setUserDetails(userDetails);
      const token = getToken();
      return Promise.all([
        getMembers(
          userDetails.policyNumber,
          userDetails.employeeCode,
          token
        ).then((members) => setMembers(members)),
        getPanelHospitalsLookup(token).then((response) =>
          setHospitals(response)
        ),
        getDocumentTypes(token).then((response) => setDocumentTypes(response)),
      ])
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const addDocument = async (newDocument: any) => {
    const currentList: any[] = [...docs];
    currentList.push(newDocument);
    setDocs(currentList);
  };

  const removeDocument = async (docKey: string) => {
    const newDocs = docs.filter((d: any) => d.key !== docKey);
    setDocs(newDocs);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setFormValues({ ...formValues, [name]: value });
  };

  const handleHospitalChange = (e: any, v: any) => {
    const newErrors = { ...errors };
    delete newErrors["panelHospitalId"];

    setErrors(newErrors);
    setFormValues({
      ...formValues,
      ["panelHospitalId"]: v,
    });
  };

  const handleSubmit = (e: any) => {
    if (validateForm()) createOpdClaim();
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formValues.panelHospitalId === "")
      newErrors["panelHospitalId"] = "Panel Hospital is required.";

    if (!formValues.claimAmount || formValues.claimAmount === 0) {
      newErrors["claimAmount"] = "Claim Amount is required ";
    }

    if (formValues.claimAmount && formValues.claimAmount > 20000)
      newErrors["claimAmount"] = "Claim amount cannot be more than 20,000.";

    if (docs.length === 0)
      newErrors["documents"] = "Atleast one document must be attached.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createOpdClaim = () => {
    setSendingRequest(true);
    const panelHospital: any = formValues.panelHospitalId;
    const documents: any = [];

    for (let index = 0; index < docs.length; index++) {
      documents.push({
        claimRequestDocumentId: 0,
        claimRequestId: 0,
        claimtDocumentTypeId: docs[index].docType,
        document: docs[index].document,
      });
    }

    const token = getToken();
    createOPDClaimRequest(
      members[selectedIndex].employeeSRNumber,
      userDetails.employeeCode,
      "opd",
      panelHospital.id.toString(),
      Number(formValues.claimAmount),
      documents,
      token
    )
      .then((response) => {
        setInfo("OPD Claim request created successfully.");
        navigate(-1);
      })
      .catch((err) => setError(err))
      .finally(() => setSendingRequest(false));
  };

  const onMemberChange = (membersIndex: any) => {
    setSelectedIndex(membersIndex);
  };

  return (
    <>
      <OPDGuidelines open={open} handleClose={handleClose} />
      <GridDX
        container
        sx={{ width: "100%", alignContent: "flex-start" }}
        rowSpacing={2}
      >
        <GridDX item xs={12}>
          <MemberSelector
            loading={loading}
            list={members}
            handleCallBack={onMemberChange}
          />
        </GridDX>

        <GridDX item xs={12}>
          <CheckBoxDX disabled />
          <Typography sx={{ fontSize: "13px" }}>
            I acknowledge that I have read, understood and agreed to the Pak
            Qatar Takaful OPD Guideline.
            <ButtonDX
              sx={{
                color: "blue",
                fontSize: "14px",
                background: "none",
                border: "none",
                boxShadow: "none",
              }}
              onClick={handleOpen}
            >
              View
            </ButtonDX>
          </Typography>
        </GridDX>

        <GridDX item xs={12}>
          <AutoCompleteListDX
            id="panelHospitalId"
            name="panelHospitalId"
            label="Hospital/Clinic"
            list={hospitals}
            value={formValues.panelHospitalId}
            onChange={handleHospitalChange}
            error={errors["panelHospitalId"] ? true : false}
            errorText={errors["panelHospitalId"]}
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            loading={loading}
          />
        </GridDX>
        <GridDX item xs={12} sx={{ flexDirection: "column" }}>
          <TextFieldDX
            name="claimAmount"
            label="Claim Amount"
            type="number"
            value={formValues.claimAmount}
            onChange={handleInputChange}
            required
            errorText={errors["claimAmount"]}
            loading={loading}
          />
          <Typography sx={{ fontSize: 12 }}>
            Maximum limit of claim via mobile is Rs. 20,000/-
          </Typography>
        </GridDX>
        <GridDX item xs={12}>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
            Kindly have the{" "}
            <Link
              href="/assets/forms/HospitalizationReimbursmentClaimForm.pdf"
              target="_blank"
              download={true}
              underline="hover"
            >
              Claim Form
            </Link>{" "}
            Filled by your treating physician and and submit below along with
            all relevant document
          </Typography>
        </GridDX>
        <GridDX>Attach Document(s)</GridDX>
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
            CREATE OPD CLAIM
          </LoadingButtonDX>
        </GridDX>
      </GridDX>
    </>
  );
};

export default OPDReimburese;
