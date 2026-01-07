import { useState, useEffect } from "react";
import GridDX from "../components/layout/griddx";
import Ellipse from "../assets/Ellipse.png";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, IconButton } from "@mui/material";
import {
  CakeOutlined,
  PhoneAndroid,
  AlternateEmail,
  Email,
  Person,
  Bookmark,
  ArrowBackOutlined,
  PhotoCamera,
  BadgeOutlined,
} from "@mui/icons-material";
import TextFieldProfilesDX from "../components/controls/textfieldprofiledx";
import ButtonDX from "../components/controls/buttondx";

import { CorrectionRecord, getMembers } from "../shared/services/memberservice";
import { useAuthContext } from "../context/authcontext";
import { useConfigContext } from "../context/configcontext";
import { useErrorContext } from "../context/errorcontext";
import {
  base64toBlob,
  dataURLtoBlob,
  getProfileImageFromDevice,
  openCameraOnMobile,
  resizeFile,
  toBase64,
} from "../shared/globals";
import UploadModalDX from "../components/controls/uploadmodalDX";

const Profile = () => {
  const navigate = useNavigate();
  const { getUserDetails, getToken } = useAuthContext();
  const [members, setMembers] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setError, setInfo } = useErrorContext();

  const [image, setimage] = useState<any>(null);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUserData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const { IMAGE_SIZE, REDUCED_IMG_MAXHEIGHT, REDUCED_IMG_MAXWIDTH } =
    useConfigContext();

  useEffect(() => {
    document.addEventListener("message", photoFromApp, false);
    window.addEventListener("message", photoFromApp, false); // for IOS

    getUserDetails().then((userDetails: any) => {
      setLoggedInUserData(userDetails);

      const token = getToken();

      getMembers(userDetails.policyNumber, userDetails.employeeCode, token)
        .then((members) => {
          setMembers(members);
          setUserData(members[0]);
          console.log("Members=> ", members);
          const win: any = window;
          if (win?.ReactNativeWebView) {
            getProfileImageFromDevice(userDetails.userId);
          }
        })
        .catch((err) => setError(err))
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => {
      document.removeEventListener("message", photoFromApp, false);
      window.removeEventListener("message", photoFromApp, false);
    };
  }, []);

  useEffect(() => {
    document.removeEventListener("message", photoFromApp, false);
    window.removeEventListener("message", photoFromApp, false);

    document.addEventListener("message", photoFromApp, false);
    window.addEventListener("message", photoFromApp, false); // for IOS

    return () => {
      document.removeEventListener("message", photoFromApp, false);
      window.removeEventListener("message", photoFromApp, false);
    };
  }, [userData]);

  const photoFromApp = async (message: any) => {
    // Ensure the message is from React Native WebView
    // if (message.origin !== "null") return; // WebViews send messages with 'null' origin

    let jsonData = JSON.parse(message.data);
    if (jsonData.data) {
      let imgBase64 = "data:image/png;base64," + jsonData.data;

      let newImage = await UpdateProfile(imgBase64, "");

      if (jsonData.key == "imagecaptured") {
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
          newImage,
          ["profileImage"], //as the only change is in Profile Image
          token
        )
          .then((res) => {
            console.log("Successfully Requested for Record Correction");
            // setInfo("Successfully Requested for Record Correction");
            // navigate(-1);
          })
          .catch((err) => {
            // setError(err);
            console.log("error in sending correction request", err);
          });
        // .finally(() => setIsSaving(false));
      }
    }
  };

  const UpdateProfileFromBrowser = async (
    capturedImage: any,
    fileName: any
  ) => {
    setimage(capturedImage);
    var imageFile: any = dataURLtoBlob(capturedImage);
    var profileImage = await toBase64(imageFile);
    let newImage = await UpdateProfile(profileImage, "");

    console.log("Profile image selected successfully.");
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
      newImage,
      ["profileImage"], //as the only change is in Profile Image
      token
    )
      .then((res) => {
        console.log("Successfully Requested for Record Correction");
        // setInfo("Successfully Requested for Record Correction");
        // navigate(-1);
      })
      .catch((err) => {
        console.log("Error in request correction", err);
      });
  };

  const UpdateProfile = async (profileImage: any, fileName: any) => {
    const sizeInMB = getBase64ImageSizeInMB(profileImage);

    let reducedImage = profileImage;

    if (sizeInMB > IMAGE_SIZE) {
      console.log("The captured Image is more than " + IMAGE_SIZE + "MB");
      let docBlob = base64toBlob(profileImage);

      reducedImage = await resizeFile(
        docBlob,
        REDUCED_IMG_MAXWIDTH,
        REDUCED_IMG_MAXHEIGHT
      );
      //  await reduceImageSizeToLimit(profileImage, sizeInMB);
    }

    setUserData({
      ...userData,
      ["profileImage"]: reducedImage,
    });
    return reducedImage;
  };

  const getBase64ImageSizeInMB = (image: any) => {
    const stringLength = image.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInMB = sizeInBytes / 1048576;
    return sizeInMB;
  };

  //This function is not being used as the clients requested to reduce size without
  //affecting quality like in WhatsApp
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
        //console.log({ newSizeInMB });

        return resolve(newImage);
      };
      image.onerror = (error) => reject(error);
    });
  };

  const calculatePercentIncrease = (sizeInMB: any) => {
    const numerator = Math.abs(sizeInMB - IMAGE_SIZE);
    const denominator = (sizeInMB + IMAGE_SIZE) / 2;
    const percent = Math.round((numerator / denominator) * 100) / 100;

    return percent;
  };

  useEffect(() => {
    getUserDetails()
      .then((userDetails: any) => {
        setMembers(userDetails);
      })
      .catch((err: any) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePictureSelection = async () => {
    const win: any = window;
    if (win?.ReactNativeWebView) {
      let details = await getUserDetails();
      openCameraOnMobile(details.userId);
    } else setUploadModal(!uploadModal);
  };

  return (
    <GridDX
      container
      sx={{
        width: "100%",
        alignContent: "flex-start",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
      rowSpacing={2}
    >
      <GridDX
        sx={{
          backgroundImage: `url(${Ellipse})`,
          width: "100%",
          height: "30%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
        }}
      >
        <GridDX
          sx={{ zIndex: 1 }}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flexDirection="column"
          paddingBottom={4}
        >
          <GridDX sx={{ position: "absolute", top: 0, left: 10 }}>
            <IconButton
              aria-label="delete"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowBackOutlined sx={{ color: "white" }} />
            </IconButton>
          </GridDX>
          <GridDX textAlign="center">
            <h4
              style={{
                color: "#ffff",
                marginBottom: 10,
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              {members && members.employeeName}
            </h4>
          </GridDX>
          {/* Avatar Section */}
          <GridDX item xs={12} justifyContent="center">
            <Badge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              onClick={() => handlePictureSelection()}
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
        </GridDX>
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="FullName"
          icon={<Person />}
          value={members?.employeeName || ""}
          loading={isLoading}
          disabled
        />
      </GridDX>

      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="DateOfBirth"
          icon={<CakeOutlined />}
          value={members?.dateOfBirth}
          loading={isLoading}
          disabled
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="Relation"
          icon={<Bookmark />}
          value={members?.relation}
          loading={isLoading}
          disabled
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="MobileNumber"
          icon={<PhoneAndroid />}
          value={members?.mobileNumber}
          loading={isLoading}
          disabled
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="EmailAddress"
          icon={<Email />}
          value={members?.emailAddress}
          loading={isLoading}
          disabled
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="EmployeeNumber"
          icon={<BadgeOutlined />}
          value={members?.certNumber}
          loading={isLoading}
          disabled
        />
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <ButtonDX
          color="success"
          onClick={() => navigate("/record-correction")}
        >
          Record Correction
        </ButtonDX>
      </GridDX>

      {uploadModal ? (
        <UploadModalDX
          show={uploadModal}
          setshow={() => setUploadModal(!uploadModal)}
          UploadFile={UpdateProfileFromBrowser}
        />
      ) : (
        ""
      )}
    </GridDX>
  );
};

export default Profile;
