import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Typography } from "@mui/material";

import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import MemberSelector from "../../components/business/memberselector";
import AutoCompleteListDX from "../../components/controls/autocompletelistdx";
import TextFieldDX from "../../components/controls/textfielddx";
import GridDX from "../../components/layout/griddx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";
import DocManagerDX from "../../components/controls/docmanagerdx";
import ParticipantSelector from "../../components/business/particpantselector";

import { toBase64 } from "../../shared/globals";

import {
  getAllClaimTypes,
  createIntimationRequest,
} from "../../shared/services/claimservice";
import { getMembers } from "../../shared/services/memberservice";
import { getPanelHospitalsLookup } from "../../shared/services/commonservice";

const PreAuthorization = () => {
  const navigate = useNavigate();
  const { getUserDetails, isAdminUser, getToken } = useAuthContext();
  const { setInfo, setError } = useErrorContext();

  const defaultValues = {
    claimTypeId: "",
    panelHospitalId: "",
    hospitalName: "",
    expectedAmount: null,
  };
  const OTHER_HOSPITAL_ID = "999999";

  const dmRef = useRef<any>();

  const [formValues, setFormValues] = useState<any>(defaultValues);
  const [errors, setErrors] = useState<any>({});

  const [claimTypes, setClaimTypes] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [sendingRequest, setSendingRequest] = useState(false);
  const [members, setMembers] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleHospitalChange = (e: any, v: any) => {
    const newErrors = { ...errors };
    delete newErrors["panelHospitalId"];

    console.log({ v });

    setErrors(newErrors);
    setFormValues({
      ...formValues,
      panelHospitalId: v,
    });
  };

  const handleSubmit = () => {
    if (validateForm()) createPreAuthorization();
  };

  const validateForm = () => {
    const docs = dmRef.current?.documentList();

    const newErrors: any = {};

    if (formValues.panelHospitalId === "")
      newErrors["panelHospitalId"] = "Panel Hospital is required.";
    else if (
      formValues.panelHospitalId.id === OTHER_HOSPITAL_ID &&
      formValues.hospitalName.length === 0
    )
      newErrors["hospitalName"] = "Hospital name is required.";

    if (!formValues.expectedAmount || formValues.expectedAmount === 0)
      newErrors["expectedAmount"] = "Expected treatment amount is required.";

    if (docs.length === 0)
      newErrors["documents"] = "Atleast one document is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createPreAuthorization = async () => {
    setSendingRequest(true);

    const panelHospital: any = formValues.panelHospitalId;
    const docs = dmRef.current.documentList();
    const documents = [];

    for (let index = 0; index < docs.length; index++) {
      documents.push({
        claimRequestDocumentId: 0,
        claimRequestId: 0,
        claimtDocumentTypeId: docs[index].docType,
        document: await toBase64(docs[index]),
      });
    }

    const employeeCode = selectedParticipant
      ? selectedParticipant.employeeCode
      : userDetails.employeeCode;

    const token = await getToken();

    createIntimationRequest(
      members[selectedIndex].employeeSRNumber,
      employeeCode,
      null,
      panelHospital.id.toString(),
      formValues.hospitalName,
      Number(formValues.expectedAmount),
      documents,
      token
    )
      .then((response) => {
        setInfo("Preauthorization request created successfully.");
        navigate(-1);
      })
      .catch((err) => setError(err))
      .finally(() => setSendingRequest(false));
  };

  const loadMembersData = async (
    policyNumber: string,
    employeeCode: string,
    certNumber: string
  ) => {
    setLoading(true);

    const token = await getToken();

    return Promise.all([
      getMembers(policyNumber, employeeCode, token).then((members) =>
        setMembers(members)
      ),
      getAllClaimTypes(certNumber, token).then((response) =>
        setClaimTypes(
          response.map((item: any) => {
            return {
              text: item.benefitDescription,
              value: item.benefitCode,
            };
          })
        )
      ),
      getPanelHospitalsLookup(token).then((response) => setHospitals(response)),
    ])
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const onMemberChange = (membersIndex: any) => {
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
      <GridDX item xs={12}>
        <Typography
          color="primary"
          sx={{ textAlign: "justify", fontWeight: "bold" }}
        >
          Please allow up to 72 hours for non-emergency/elective admissions’.
          For emergency cases, please rush to the nearest Panel Hospital and
          inform them that you are a Pak-Qatar covered member
        </Typography>
      </GridDX>

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
            <AutoCompleteListDX
              id="panelHospitalId"
              name="panelHospitalId"
              label="Panel Hospital"
              list={hospitals}
              value={formValues.panelHospitalId}
              onChange={handleHospitalChange}
              required
              error={errors["panelHospitalId"] ? true : false}
              errorText={errors["panelHospitalId"]}
              InputLabelProps={{ style: { pointerEvents: "auto" } }}
              loading={loading}
            />
          </GridDX>
          {formValues.panelHospitalId &&
            formValues.panelHospitalId.id === OTHER_HOSPITAL_ID && (
              <GridDX item xs={12} sx={{ flexDirection: "column" }}>
                <TextFieldDX
                  name="hospitalName"
                  label="Hospital Name"
                  value={formValues.hospitalName}
                  onChange={handleInputChange}
                  required
                  errorText={errors["hospitalName"]}
                  loading={loading}
                />
              </GridDX>
            )}
          <GridDX item xs={12} sx={{ flexDirection: "column" }}>
            <TextFieldDX
              name="expectedAmount"
              label="Expected Treatment Amount"
              type="number"
              value={formValues.expectedAmount}
              onChange={handleInputChange}
              required
              errorText={errors["expectedAmount"]}
              loading={loading}
            />
          </GridDX>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
            Kindly have the{" "}
            <Link
              href="/assets/forms/PreAuthorizationForm.pdf"
              download={true}
              underline="hover"
            >
              Pre-Authorization Form
            </Link>{" "}
            Filled by your treating physician and and submit below along with
            all relevant document
          </Typography>
          <GridDX item xs={12} justifyContent="center">
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
          <GridDX item xs={12}>
            <DocManagerDX ref={dmRef} loading={loading} />
          </GridDX>
          <GridDX item xs={12} justifyContent="center">
            <LoadingButtonDX
              color="success"
              loading={loading || sendingRequest}
              onClick={handleSubmit}
            >
              Submit Pre authorization
            </LoadingButtonDX>
          </GridDX>
        </>
      )}
    </GridDX>
  );
};

export default PreAuthorization;
