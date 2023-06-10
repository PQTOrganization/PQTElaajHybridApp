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
} from "@mui/icons-material";
import TextFieldProfilesDX from "../components/controls/textfieldprofiledx";
import ButtonDX from "../components/controls/buttondx";

import { getMembers } from "../shared/services/memberservice";
import { useAuthContext } from "../context/authcontext";

const Profile = () => {
  const navigate = useNavigate();
  const { getUserDetails } = useAuthContext();
  const [members, setMembers] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserDetails()
      .then((userDetails: any) => {
        console.log("User Details", userDetails);
        setMembers(userDetails);
      })
      .catch((err: any) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start", height: "100vh" }}
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
          <GridDX>
            <Badge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              // onClick={() => setUploadModal(!uploadModal)}
              // badgeContent={
              // 	<AddCircleRounded
              // 		// size="large"
              // 		style={{
              // 			color: '#141233',
              // 			backgroundColor: '#ffffff',
              // 			borderRadius: '100%',
              // 			borderWidth: '0px',
              // 		}}
              // 	/>
              // }
              overlap="circular"
            >
              <Avatar
                alt=""
                // src={
                //   image
                //     ? image
                //     : userData.profileImage
                //     ? process.env.REACT_APP_BASE_API +
                //       "reviewers/profile/" +
                //       userData.profileImage
                //     : "/static/images/avatar/1.jpg"
                // }
                src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-Picture.png"
                sx={{ width: 90, height: 90, textAlign: "center" }}
              />
            </Badge>
          </GridDX>
        </GridDX>
      </GridDX>

      {/* {data.map((item) => {
        return (
          <TextFieldProfilesDX loading={isLoading} name={item.name} icon={item.icon} value={item.value} disabled />
          );
			})} */}
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
          name="CNIC"
          icon={<AlternateEmail />}
          value={members?.cnic}
          loading={isLoading}
          disabled
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldProfilesDX
          name="EmployeeNumber"
          icon={<Email />}
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
    </GridDX>
  );
};

export default Profile;
