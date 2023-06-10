import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import GridDX from "../../components/layout/griddx";
import TextFieldDX from "../../components/controls/textfielddx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import SelectListDX from "../../components/controls/selectlistdx";
import {
  createComplaintForMember,
  getComplaintTypes,
  getComplaintDetails,
} from "../../shared/services/complaintservice";

const ManageComplaint = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { getUserDetails, getToken } = useAuthContext();
  const { setInfo, setError } = useErrorContext();

  const defaultValues = {
    complainId: 0,
    complainTypeId: 0,
    subject: "",
    message: "",
    response: "",
  };

  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState<any>({});

  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [complaintTypes, setComplaintTypes] = useState<any>([]);

  useEffect(() => {
    const complainId = state ? state.complainId : -1;
    const token = getToken();
    getComplaintTypes(token)
      .then((response) => {
        setComplaintTypes(
          response.map((item: any) => {
            return { text: item.typeName, value: item.complainTypeId };
          })
        );

        if (complainId !== -1) {
          return getComplaintDetails(complainId, token).then((complaintData) =>
            setFormValues({
              complainId: complainId,
              complainTypeId: complaintData.complainTypeId,
              subject: complaintData.subject,
              message: complaintData.message,
              response: complaintData.response,
            })
          );
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: any) => {
    if (formValues.complainId !== 0) navigate(-1);
    else if (validateForm()) createComplaint();
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formValues.complainTypeId === 0) {
      newErrors["complainTypeId"] = "Complain Type is required";
    }

    if (formValues.subject === "")
      newErrors["subject"] = "Subject is required.";

    if (formValues.message === "")
      newErrors["message"] = "Message is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createComplaint = () => {
    setSendingRequest(true);

    getUserDetails().then((userDetails: any) => {
      const token = getToken();

      createComplaintForMember(
        userDetails.policyNumber,
        userDetails.certNumber,
        formValues.complainTypeId,
        formValues.subject,
        formValues.message,
        token
      )
        .then(() => {
          setInfo("Complain created successfully.");
          navigate(-1);
        })
        .catch((err) => setError(err))
        .finally(() => setSendingRequest(false));
    });
  };

  return (
    <>
      {loading && (
        <GridDX
          container
          sx={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
            height: "100%",
          }}
          rowSpacing={2}
        >
          <CircularProgress />
        </GridDX>
      )}
      {!loading && (
        <>
          <GridDX
            container
            sx={{ width: "100%", alignContent: "flex-start" }}
            rowSpacing={2}
          >
            <GridDX item xs={12}>
              <SelectListDX
                name="complainTypeId"
                label="Complain Type"
                items={complaintTypes}
                value={formValues.complainTypeId}
                onChange={handleInputChange}
                errorText={errors["complainTypeId"]}
                required
                readOnly={formValues.complainId !== 0}
              />
            </GridDX>
            <GridDX item xs={12}>
              <TextFieldDX
                name="subject"
                label="Subject"
                value={formValues.subject}
                onChange={handleInputChange}
                errorText={errors["subject"]}
                required
                readOnly={formValues.complainId !== 0}
              />
            </GridDX>
            <GridDX item xs={12}>
              <TextFieldDX
                name="message"
                label="Message"
                value={formValues.message}
                onChange={handleInputChange}
                errorText={errors["message"]}
                required
                multiline
                rows={3}
                readOnly={formValues.complainId !== 0}
              />
            </GridDX>
            <GridDX item xs={12} justifyContent="center">
              <LoadingButtonDX
                type="submit"
                color="success"
                onClick={handleSubmit}
                loading={sendingRequest}
              >
                {formValues.complainId === 0 ? "Create Complaint" : "Close"}
              </LoadingButtonDX>
            </GridDX>
          </GridDX>
        </>
      )}
    </>
  );
};

export default ManageComplaint;
