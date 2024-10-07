import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Avatar, Badge } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { PhotoCamera } from "@mui/icons-material";

import { useErrorContext } from "../context/errorcontext";
import { useAuthContext } from "../context/authcontext";
import { useConfigContext } from "../context/configcontext";

import GridDX from "../components/layout/griddx";
import MemberSelector from "../components/business/memberselector";
import CheckBoxDX from "../components/controls/checkboxdx";
import DatePickerDX from "../components/controls/datepickerdx";
import UploadModalDX from "../components/controls/uploadmodalDX";
import TextFieldDX from "../components/controls/textfielddx";
import LoadingButtonDX from "../components/controls/loadingbuttondx";

import { dataURLtoBlob, toBase64 } from "../shared/globals";
import { CorrectionRecord, getMembers } from "../shared/services/memberservice";

const RecordCorrection = () => {
  const dmRef = useRef<any>();
  const navigate = useNavigate();
  const { getUserDetails, getToken } = useAuthContext();
  const { setError, setInfo } = useErrorContext();
  const { IMAGE_SIZE } = useConfigContext();

  const [members, setMembers] = useState<any>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [image, setimage] = useState<any>(null);
  const [blob, setBlob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loggedInUser, setLoggedInUserData] = useState<any>(null);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      setLoggedInUserData(userDetails);

      const token = getToken();

      getMembers(userDetails.policyNumber, userDetails.employeeCode, token)
        .then((members) => {
          setMembers(members);
          setUserData(members[0]);
        })
        .catch((err) => setError(err))
        .finally(() => {
          setIsLoading(false);
        });
    });
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

  const UpdateProfile = async (capturedImage: any, fileName: any) => {
    setimage(capturedImage);
    var imageFile: any = dataURLtoBlob(capturedImage);
    var profileImage = await toBase64(imageFile);

    const sizeInMB = getBase64ImageSizeInMB(profileImage);

    let reducedImage = profileImage;

    if (sizeInMB > IMAGE_SIZE) {
      console.log("The captured Image is more than " + IMAGE_SIZE + "MB");

      reducedImage = await reduceImageSizeToLimit(profileImage, sizeInMB);
    }

    setUserData({
      ...userData,
      ["profileImage"]: reducedImage,
    });
  };

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

  const onHandleDateChange = (fieldName: string, dateValue: Date) => {
    handleInputChange({ target: { name: fieldName, value: dateValue } });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      PostRecordCorrection();
    }
  };

  const PostRecordCorrection = () => {
    setIsSaving(true);
    const token = getToken();

    CorrectionRecord(
      loggedInUser.emailAddress,
      userData.employeeSRNumber,
      userData.employeeFolioId,
      userData.employeeName,
      userData.employeeCNIC,
      userData.employeeDateOfBirth,
      userData.IBAN,
      userData.employeeMobile,
      userData.employeeEmail,
      userData.profileImage,
      token
    )
      .then((res) => {
        setInfo("Successfully Requested for Record Correction ");
        navigate(-1);
      })
      .catch((err) => {
        setInfo("Record Correction Request failed");
      })
      .finally(() => setIsSaving(false));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (userData.employeeName.length === 0)
      newErrors["employeeName"] = "Member Name is required";

    if (userData.employeeCNIC.length === 0)
      newErrors["employeeCNIC"] = "CNIC is required";

    if (!userData.employeeDateOfBirth)
      newErrors["employeeDateOfBirth"] = "Date Of Birth is required";

    if (!isAcknowledged)
      newErrors["isAcknowledge"] = "Please acknowledge the terms";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onMemberSelectionChange = (membersIndex: number) => {
    setUserData(members[membersIndex]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX
        container
        sx={{ width: "100%", alignContent: "flex-start" }}
        rowSpacing={2}
      >
        <GridDX item xs={12}>
          <MemberSelector
            list={members}
            ref={dmRef}
            handleCallBack={onMemberSelectionChange}
            loading={isLoading}
          />
        </GridDX>
        {/* Avatar Section */}
        <GridDX item xs={12} justifyContent="center">
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            onClick={() => setUploadModal(!uploadModal)}
            badgeContent={
              <PhotoCamera
                style={{
                  color: "#141233",
                  backgroundColor: "#ffffff",
                  borderRadius: "100%",
                  borderWidth: "0px",
                }}
              />
            }
            overlap="circular"
          >
            <Avatar
              alt="Profile Image"
              src={
                userData?.profileImage
                  ? userData.profileImage
                  : "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-Picture.png"
              }
              sx={{ width: 90, height: 90, textAlign: "center" }}
            />
          </Badge>
        </GridDX>

        <GridDX item xs={12}>
          <TextFieldDX
            label="Member Name"
            name="employeeName"
            value={userData?.employeeName || ""}
            onChange={handleInputChange}
            errorText={errors["employeeName"]}
            loading={isLoading}
            required
          />
        </GridDX>
        <GridDX item xs={12}>
          <TextFieldDX
            label="CNIC"
            name="employeeCNIC"
            value={userData?.employeeCNIC || ""}
            onChange={handleInputChange}
            errorText={errors["employeeCNIC"]}
            loading={isLoading}
            required
          />
        </GridDX>
        <GridDX item xs={12}>
          <DatePickerDX
            label="Date Of Birth"
            name="employeeDateOfBirth"
            value={userData?.employeeDateOfBirth}
            onChange={(dateValue: Date) => {
              onHandleDateChange("employeeDateOfBirth", dateValue);
            }}
            onAccept={(dateValue: Date) => {
              onHandleDateChange("employeeDateOfBirth", dateValue);
            }}
            errorText={errors["employeeDateOfBirth"]}
            loading={isLoading}
            required
          />
        </GridDX>
        <GridDX item xs={12}>
          <TextFieldDX
            label="Mobile"
            name="employeeMobile"
            type="number"
            value={userData?.employeeMobile}
            onChange={handleInputChange}
            errorText={errors["employeeMobile"]}
            loading={isLoading}
            required
          />
        </GridDX>
        <GridDX item xs={12}>
          <TextFieldDX
            label="Email"
            name="employeeEmail"
            value={userData?.employeeEmail}
            onChange={handleInputChange}
            errorText={errors["employeeEmail"]}
            loading={isLoading}
            required
          />
        </GridDX>

        <GridDX item xs={12} alignItems="center">
          <CheckBoxDX
            checked={isAcknowledged}
            onChange={() => setIsAcknowledged(!isAcknowledged)}
          />
          <Typography sx={{ fontSize: "13px" }}>
            I acknowledge that provided information is correct and I have read,
            understood and agreed to the Pak Qatar Takaful Policy & Procedure
          </Typography>
        </GridDX>
        <GridDX item xs={12} alignItems="center">
          {errors["isAcknowledge"] && (
            <Typography sx={{ fontSize: "13px" }} color={"error"}>
              {errors["isAcknowledge"]}
            </Typography>
          )}
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          <LoadingButtonDX loading={isSaving} onClick={handleSubmit}>
            Request Correction
          </LoadingButtonDX>
        </GridDX>
        {uploadModal ? (
          <UploadModalDX
            show={uploadModal}
            setshow={() => setUploadModal(!uploadModal)}
            UploadFile={UpdateProfile}
          />
        ) : (
          ""
        )}
      </GridDX>
    </LocalizationProvider>
  );
};

export default RecordCorrection;
