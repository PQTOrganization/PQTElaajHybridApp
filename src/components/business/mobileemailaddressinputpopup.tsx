import { Modal, Box, Typography } from "@mui/material";
import GridDX from "../layout/griddx";
import ButtonDX from "../controls/buttondx";
import TextFieldDX from "../controls/textfielddx";
import { useEffect, useState } from "react";
import { formatTimerToMinAndSecs, isEmail } from "../../shared/globals";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authcontext";
import {
  sendOTP,
  updateContactInfo,
} from "../../shared/services/accountservice";
import { useConfigContext } from "../../context/configcontext";
import { useErrorContext } from "../../context/errorcontext";
import LoadingButtonDX from "../controls/loadingbuttondx";

const MobileEmailAddressInputPopup = (props: any) => {
  const navigate = useNavigate();

  const { RESEND_TIMER } = useConfigContext();
  const { setInfo, setError } = useErrorContext();

  const defaultValues = {
    mobileNumber: "",
    emailAddress: "",
  };

  const [userData, setUserData] = useState<any>(defaultValues);
  const [errors, setErrors] = useState<any>({});
  const [stepNumber, setStepNumber] = useState(1);
  const [emailOTP, setEmailOTP] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [seconds, setSeconds] = useState(RESEND_TIMER);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 400,
    width: "70%",
    bgcolor: "background.paper",
    border: "3px solid #8B0037",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  let isSubscribed = true;
  let timeOutRef: any;

  useEffect(() => {
    if (stepNumber === 2) {
      if (seconds > 0) {
        timeOutRef = setTimeout(() => {
          if (isSubscribed)
            setSeconds(
              Number(seconds) - 1 < 10 ? "0" + (seconds - 1) : seconds - 1
            );
        }, 1000);
      }
    }

    return () => {
      isSubscribed = false;

      if (timeOutRef) clearTimeout(timeOutRef);
    };
  });

  useEffect(() => {
    if (props.user) {
      setUserData({
        userID: props.user.userId,
        mobileNumber: props.user.mobileNumber, //formatMobileNumber(props.user.mobileNumber),
        emailAddress: props.user.emailAddress,
      });
    }
  }, [props.user]);

  // const formatMobileNumber = (value: string) => {
  //   if (value.startsWith("92")) {
  //     return "+" + value;
  //   } else return value;
  // };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleMobileNumberChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    let input = value;
    // Remove all invalid characters except +, digits, and space
    input = input.replace(/[^\d+\s]/g, "");
    // Limit to 11 digits Only
    if (input.length > 11) {
      input = input.slice(0, 11);
    }
    // Ensure + only appears at the beginning (if at all)
    if (input.includes("+")) {
      // Remove all '+' and add one at the start if originally present
      input = "+" + input.replace(/\+/g, "").trimStart();
    }

    setErrors(newErrors);
    setUserData({
      ...userData,
      mobileNumber: input,
    });
  };

  const validateData = () => {
    const newErrors: any = {};
    if (!userData?.mobileNumber) {
      newErrors["mobileNumber"] = "Please enter valid Mobile Number";
    } else {
      const num = userData.mobileNumber;

      // Must start with 0 and be exactly 11 digits
      if (!/^0\d{10}$/.test(num)) {
        newErrors["mobileNumber"] =
          "Mobile number must start with 0 and be 11 digits long";
      }
    }
    if (!userData?.emailAddress) {
      newErrors["emailAddress"] = "Please enter valid Email Address";
    }
    if (userData.emailAddress) {
      if (!isEmail(userData?.emailAddress)) {
        newErrors["emailAddress"] = "Please enter valid Email Address";
      }
    }

    if (stepNumber === 2) {
      if (!emailOTP) {
        newErrors["emailOTP"] = "Please enter Email OTP";
      }
      if (!mobileOTP) {
        newErrors["mobileOTP"] = "Please enter SMS OTP";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSave = () => {
    if (validateData()) {
      resendOTP().then(() => {
        setStepNumber(2);
      });
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    sendOTP(userData.userID, userData.emailAddress, userData.mobileNumber)
      .then(() => setSeconds(RESEND_TIMER))
      .catch((err) => {
        const data = JSON.parse(err);
        setError(data.Message || "Error");
      })
      .finally(() => setIsLoading(false));
  };

  const onVerify = () => {
    if (validateData()) {
      setIsSaving(true);
      updateContactInfo({
        userID: userData.userID,
        mobileNumber: userData.mobileNumber,
        emailAddress: userData.emailAddress,
        emailOTP: emailOTP,
        mobileOTP: mobileOTP,
        employeeCode: props.user?.employeeCode,
        policyNumber: props.user?.policyNumber,
      })
        .then(() => {
          setInfo("Details have been updated");
          navigate("/home");
        })
        .catch((err: any) => {
          console.log("RAW ERROR:", err);
          setError(err);
        })

        .finally(() => setIsSaving(false));
    }
  };

  const resetPopupState = () => {
    setErrors({});
    setStepNumber(1);
    setEmailOTP("");
    setMobileOTP("");
    setSeconds(RESEND_TIMER);
  };

  return (
    <Modal
      open={props.show}
      onClose={() => {
        resetPopupState();
        props.setshow(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ borderColor: "#8B0037" }}
    >
      <Box sx={style}>
        <GridDX
          container
          sx={{ width: "100%", alignContent: "flex-start" }}
          rowSpacing={2}
        >
          {stepNumber === 1 && (
            <>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginBottom: 20 }}
              >
                <Typography>
                  Please check the below details. If any information has
                  changed, kindly update.
                </Typography>
              </GridDX>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginBottom: 8 }}
              >
                <TextFieldDX
                  label="Mobile Number"
                  name="mobileNumber"
                  value={userData?.mobileNumber || ""}
                  onChange={handleMobileNumberChange}
                  errorText={errors["mobileNumber"]}
                  required
                />
              </GridDX>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginTop: 8, marginBottom: 16 }}
              >
                <TextFieldDX
                  label="Email Address"
                  name="emailAddress"
                  value={userData?.emailAddress || ""}
                  onChange={handleInputChange}
                  errorText={errors["emailAddress"]}
                  required
                />
              </GridDX>
              <GridDX item xs={12} justifyContent="center">
                <GridDX container spacing={2}>
                  <GridDX item xs={6}>
                    <ButtonDX
                      style={{ width: "100%" }}
                      onClick={() => {
                        resetPopupState();
                        props.setshow(false);
                      }}
                    >
                      Cancel
                    </ButtonDX>
                  </GridDX>
                  <GridDX item xs={6}>
                    <LoadingButtonDX
                      loading={isLoading}
                      style={{ width: "100%" }}
                      color="success"
                      onClick={onSave}
                    >
                      Save
                    </LoadingButtonDX>
                  </GridDX>
                </GridDX>
              </GridDX>
            </>
          )}
          {stepNumber === 2 && (
            <>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginBottom: 20 }}
              >
                <Typography>
                  Read the following details carefully and enter OTP code sent
                  to your Email Address and Mobile to verify.
                </Typography>
              </GridDX>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginTop: 8, marginBottom: 16 }}
              >
                <TextFieldDX
                  label="Mobile Number"
                  name="mobileNumber"
                  value={userData?.mobileNumber || ""}
                />
              </GridDX>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginTop: 8, marginBottom: 16 }}
              >
                <TextFieldDX
                  label="Email Address"
                  name="emailAddress"
                  value={userData?.emailAddress || ""}
                />
              </GridDX>
              <GridDX item xs={12} sx={{ marginTop: 8, marginBottom: 16 }}>
                <TextFieldDX
                  label="Email OTP"
                  type="text"
                  value={emailOTP}
                  onChange={(e: any) => setEmailOTP(e.target.value)}
                  errorText={errors["emailOTP"]}
                  required
                />
              </GridDX>
              <GridDX item xs={12} sx={{ marginTop: 2, marginBottom: 16 }}>
                <TextFieldDX
                  label="SMS OTP"
                  type="text"
                  value={mobileOTP}
                  onChange={(e: any) => setMobileOTP(e.target.value)}
                  errorText={errors["mobileOTP"]}
                  required
                />
              </GridDX>
              <GridDX
                item
                xs={12}
                justifyContent="center"
                sx={{ marginTop: 8, marginBottom: 16 }}
              >
                <LoadingButtonDX
                  loading={isLoading}
                  style={{
                    width: "30%",
                    marginTop: "0",
                  }}
                  onClick={resendOTP}
                  disabled={seconds !== "00"}
                >
                  Resend OTP
                </LoadingButtonDX>
                <Typography variant={"h6"} style={{ marginLeft: 30 }}>
                  {formatTimerToMinAndSecs(seconds)}
                </Typography>
              </GridDX>

              <GridDX item xs={12} justifyContent="center">
                <LoadingButtonDX
                  isLoading={isSaving}
                  style={{
                    width: "80%",
                    marginTop: "0",
                  }}
                  color="success"
                  text={"Verify"}
                  onClick={onVerify}
                >
                  Verify
                </LoadingButtonDX>
              </GridDX>
            </>
          )}
        </GridDX>
      </Box>
    </Modal>
  );
};

export default MobileEmailAddressInputPopup;
