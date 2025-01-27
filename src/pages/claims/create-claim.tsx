import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Typography } from "@mui/material";

import LoadingButtonDX from "../../components/controls/loadingbuttondx";
import SelectListDX from "../../components/controls/selectlistdx";
import TextFieldDX from "../../components/controls/textfielddx";
import GridDX from "../../components/layout/griddx";
import DocumentAttachDX from "../../components/controls/documentattachdx";
import MemberSelector from "../../components/business/memberselector";
import ParticipantSelector from "../../components/business/particpantselector";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import {
  getAllClaimTypes,
  getDocumentTypes,
} from "../../shared/services/claimservice";
import { getPanelHospitalsLookup } from "../../shared/services/commonservice";
import { getMembers } from "../../shared/services/memberservice";
import { createClaimRequest } from "../../shared/services/claimservice";
import {
  formattedNumber,
  getBase64ImageSizeInMB,
  readableFileSize,
} from "../../shared/globals";
import { useConfigContext } from "../../context/configcontext";

const CreateClaim = () => {
  const navigate = useNavigate();
  const { getUserDetails, isAdminUser, getToken } = useAuthContext();
  const { setInfo, setError } = useErrorContext();
  const { CUMULATIVE_DOC_SIZE } = useConfigContext();

  let cumulativeInBytes = CUMULATIVE_DOC_SIZE * 1000000;

  const defaultValues = {
    claimTypeId: "",
    panelHospitalId: "",
    claimAmount: null,
  };

  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState<any>({});
  const [claimTypes, setClaimTypes] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<any>([]);
  const [docs, setDocs] = useState<any>([]);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [members, setMembers] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [claimLimit, setClaimLimit] = useState(20000);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [totalSize, setTotalSize] = useState("0");

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      setUserDetails(userDetails);

      if (!isAdminUser()) {
        loadMembersData(
          userDetails.policyNumber,
          userDetails.employeeCode,
          userDetails.certNumber
        );
      }
    });
  }, []);

  useEffect(() => {
    if (isAdminUser() && selectedParticipant) {
      loadMembersData(
        selectedParticipant.policyNumber,
        selectedParticipant.employeeCode,
        selectedParticipant.certNumber
      );
    }
  }, [selectedParticipant]);

  useEffect(() => {
    let totalSize = calculateCumulativeSize();
    setTotalSize(readableFileSize(totalSize));
  }, [docs]);

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
    const { name, value, id } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === "claimTypeId") {
      if (
        // value === "RGHOPSV01" ||
        // value === "RGHOPV01" ||
        value === "GH202207589132"
      )
        setClaimLimit(25000);
      else setClaimLimit(20000);
    }
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

  const handleSubmit = () => {
    if (validateForm()) createClaim();
  };

  const calculateCumulativeSize = () => {
    let cumSize = 0;
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      cumSize += element.size; //getBase64ImageSizeInMB(element.document);
    }
    console.log("cum size", cumSize);
    return cumSize;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formValues.claimTypeId === "")
      newErrors["claimTypeId"] = "Claim type is required.";

    if (!formValues.claimAmount || formValues.claimAmount === 0)
      newErrors["claimAmount"] = "Claim amount is required.";

    if (formValues.claimAmount && formValues.claimAmount > claimLimit)
      newErrors["claimAmount"] =
        "Claim amount cannot be more than " + formattedNumber(claimLimit);

    if (docs.length === 0)
      newErrors["documents"] = "Atleast one document must be attached.";
    else {
      let cumSize = calculateCumulativeSize();
      if (cumSize >= cumulativeInBytes)
        newErrors["documents"] =
          "Size of all documents is more than the allowed size of " +
          CUMULATIVE_DOC_SIZE +
          " MB.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createClaim = () => {
    setSendingRequest(true);

    const panelHospital: any = formValues.panelHospitalId;
    const documents = [];

    for (let index = 0; index < docs.length; index++) {
      documents.push({
        claimRequestDocumentId: 0,
        claimRequestId: 0,
        claimtDocumentTypeId: docs[index].docType,
        document: docs[index].document,
      });
    }

    const employeeCode = selectedParticipant
      ? selectedParticipant.employeeCode
      : userDetails.employeeCode;

    const token = getToken();

    createClaimRequest(
      members[selectedIndex].employeeSRNumber,
      employeeCode,
      formValues.claimTypeId,
      null,
      Number(formValues.claimAmount),
      documents,
      token
    )
      .then((response) => {
        setInfo("Claim request created successfully.");
        navigate(-1);
      })
      .catch((err) => setError(err))
      .finally(() => setSendingRequest(false));
  };

  const loadClaimTypes = async (certNumber: string) => {
    const token = getToken();
    return getAllClaimTypes(certNumber, token).then((response) => {
      setClaimTypes(
        response.map((item: any) => {
          return {
            text: item.benefitDescription,
            value: item.benefitCode,
          };
        })
      );
    });
  };

  const loadMembersData = async (
    policyNumber: string,
    employeeCode: string,
    certNumber: string
  ) => {
    setLoading(true);

    const token = getToken();
    return Promise.all([
      getMembers(policyNumber, employeeCode, token).then((members) =>
        setMembers(members)
      ),
      loadClaimTypes(certNumber),
      getPanelHospitalsLookup(token).then((response) => {
        setHospitals(response);
      }),
      getDocumentTypes(token).then((response) => {
        setDocumentTypes(response);
      }),
    ])
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const onMemberChange = (membersIndex: any) => {
    loadClaimTypes(members[membersIndex].employeeSRNumber);
    setSelectedIndex(membersIndex);
  };

  const onParticipantSelected = (participant: any) => {
    setSelectedParticipant(participant);
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start", height: "100%" }}
      rowSpacing={2}
    >
      {isAdminUser() && (
        <GridDX item xs={12}>
          <ParticipantSelector
            loading={loading}
            userData={userDetails}
            onSelected={onParticipantSelected}
          />
        </GridDX>
      )}

      {(!isAdminUser() || (isAdminUser() && selectedParticipant)) && (
        <>
          <GridDX item xs={12} sx={{ flexDirection: "column" }}>
            <Typography>Please select patient name</Typography>
            <MemberSelector
              loading={loading}
              list={members}
              handleCallBack={onMemberChange}
            />
          </GridDX>
          <GridDX item xs={12}>
            <SelectListDX
              label="Claim Type"
              name="claimTypeId"
              items={claimTypes}
              value={formValues.claimTypeId}
              onChange={handleInputChange}
              errorText={errors["claimTypeId"]}
              loading={loading}
              required
            />
          </GridDX>
          <GridDX item xs={12} sx={{ flexDirection: "column" }}>
            <TextFieldDX
              name="claimAmount"
              label="Claim Amount"
              type="number"
              value={formValues.claimAmount}
              onChange={handleInputChange}
              errorText={errors["claimAmount"]}
              loading={loading}
              required
            />
            <Typography sx={{ fontSize: 12 }}>
              Maximum limit of claim via mobile is Rs.
              {formattedNumber(claimLimit)}/-
            </Typography>
          </GridDX>
          <GridDX item xs={12}>
            <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
              Kindly have the{" "}
              <Link
                href="/assets/forms/HospitalizationReimbursmentClaimForm.pdf"
                download={true}
                underline="hover"
              >
                Claim Form (Page 1 & 2)
              </Link>{" "}
              Filled by your treating physician and and submit below along with
              all relevant document
            </Typography>
          </GridDX>
          <GridDX xs={6}>Attach Document(s)</GridDX>
          <GridDX xs={6} justifyContent="right">
            <Typography
              sx={{ color: "#8B0037", fontWeight: "bold", textAlign: "right" }}
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
              Submit Claim
            </LoadingButtonDX>
          </GridDX>
        </>
      )}
    </GridDX>
  );
};

export default CreateClaim;
