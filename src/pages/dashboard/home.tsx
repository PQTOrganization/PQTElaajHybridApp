import { useEffect, useState } from "react";
import { CardContent, Collapse, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContactIcon from "@mui/icons-material/AlternateEmail";
import BenefitIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ClaimRequestIcon from "@mui/icons-material/VaccinesOutlined";
import RecordCorrectIcon from "@mui/icons-material/DifferenceOutlined";
import ValueAddedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ComplainIcon from "@mui/icons-material/CampaignOutlined";
import ClaimsIcon from "@mui/icons-material/PaidOutlined";
import ProductIcon from "@mui/icons-material/CategoryOutlined";

import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import ButtonDX from "../../components/controls/buttondx";
import BoxDX from "../../components/layout/boxdx";
import GridDX from "../../components/layout/griddx";
import CardDX from "../../components/layout/carddx";
import CardButtonDX from "../../components/controls/cardbuttondx";
import HorizontalScrollCardsDX from "../../components/layout/horizontalscrollcardsdx";
import AlertComponenet from "../../components/alerts/alert";

import TeleDoctorImage from "../../assets/tele_doctor_new.png";

import { getMembers } from "../../shared/services/memberservice";
import {
  requestCameraStoragePermissionFromDevice,
  requestLocationPermissionFromDevice,
} from "../../shared/globals";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getUserDetails, getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const cardMenus = [
    {
      // icon:<Avatar src={benefits} sx={{objectFit:"contain"}} /> ,
      icon: <BenefitIcon />,
      label: "Benefits & Limits",
      link: "/benefits-limits",
    },
    {
      icon: <ClaimsIcon />,
      label: "Pending Claims",
      link: "/pending-claims",
    },
    {
      icon: <ClaimsIcon />,
      label: "Claim History",
      link: "/claim-history",
    },
    {
      icon: <ClaimRequestIcon />,
      label: "Submit Pre authorization",
      link: "/preauthorization",
    },
    {
      icon: <ClaimRequestIcon />,
      label: "Claim Reimbursement",
      link: "/create-claim",
    },
    {
      icon: <ValueAddedIcon />,
      label: "Value Added Services",
      link: "/value-added-services",
    },
    {
      icon: <RecordCorrectIcon />,
      label: "Record Correction",
      link: "/record-correction",
    },
    {
      icon: <ProductIcon />,
      label: "Takaful Products & Solutions",
      link: "/products-solutions",
    },
    {
      icon: <ContactIcon />,
      label: "Contact Us",
      link: "/contact-us",
    },
  ];
  const [panelIndex, setPanelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    requestLocationPermissionFromDevice();
    requestCameraStoragePermissionFromDevice();

    getUserDetails().then((data: any) => {
      const token = getToken();
      getMembers(data.policyNumber, data.employeeCode, token)
        .then((members: any) => {
          console.log(members);
          setMembers(members);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const togglePanelIndex = () => {
    setPanelIndex((panelIndex + 1) % 2);
  };

  const checkOPDBenefits = (link: string) => {
    getUserDetails().then((userDetails: any) => {
      if (userDetails.benefits) {
        const hasOPDBenefit = userDetails.benefits.findIndex(
          (b: any) =>
            b.benefitCode === "RGHOPSV01" || b.benefitCode === "RGHOPV01"
        );

        if (hasOPDBenefit === -1) {
          setShowAlert(true);
          return;
        }
      }

      navigate(link);
    });
  };

  const checkPreAuthBenefits = (link: string) => {
    getUserDetails().then((userDetails: any) => {
      if (userDetails.benefits) {
        const hasPreAuthBenefit = userDetails.benefits.findIndex(
          (b: any) =>
            b.benefitCode === "BGHTV02" ||
            b.benefitCode === "RGHMMV01" ||
            b.benefitCode === "BGHTVS02" ||
            b.benefitCode === "RGHMMV01" ||
            b.benefitCode === "RGHMMVS01"
        );

        if (hasPreAuthBenefit === -1) {
          setShowAlert(true);
          return;
        }
      }

      navigate(link);
    });
  };

  const showMenuBoxes = () => {
    return (
      <BoxDX
        sx={{
          display: "flex",
          flexWrap: panelIndex === 0 ? "none" : "wrap",
          justifyContent: panelIndex === 0 ? "left" : "space-around",
          my: 1,
        }}
      >
        {cardMenus.map((menu: any, i: number) => (
          <CardButtonDX
            key={"cb_" + i + panelIndex}
            label={menu.label}
            icon={menu.icon}
            link={menu.link}
            onClick={
              menu.link === "/opd-reimburse"
                ? () => checkOPDBenefits(menu.link)
                : menu.link === "/preauthorization"
                ? () => checkPreAuthBenefits(menu.link)
                : null
            }
          />
        ))}
      </BoxDX>
    );
  };

  const showTeleDoctorCard = () => {
    return (
      <CardDX sx={{ width: "100%" }}>
        <CardContent>
          <GridDX container sx={{ width: "100%" }} columnSpacing={1}>
            <GridDX item xs={4}>
              <img src={TeleDoctorImage} width={110} height={132} />
            </GridDX>
            <GridDX item xs={8} sx={{ flexDirection: "column" }}>
              <Typography sx={{ fontWeight: "bold" }} color="primary">
                Tele Doctor
              </Typography>
              <Typography sx={{ fontSize: 10, color: "#A7A7A7" }}>
                Telemedicine service provider partnered with Pak-Qatar Takaful
                has a network of over 7,000 physicians; connecting them with
                patients through online means - providing convenient e-health
                solutions.
              </Typography>
              <ButtonDX
                sx={{ mt: 1, width: "48%", background: "#007A48" }}
                size="small"
                // onClick={() => navigate("/tele-doctor")}
              >
                Read More
              </ButtonDX>
            </GridDX>
          </GridDX>
        </CardContent>
      </CardDX>
    );
  };

  const handleScroll = (e: any) => {
    const element = e.target;

    const closeToBottom = //Math.abs(
      element.scrollHeight - element.clientHeight - element.scrollTop;
    //);

    // if (closeToBottom < 1 && panelIndex === 0) {
    //   setPanelIndex(1);
    //   return;
    // }

    // if (closeToBottom > 311 && panelIndex === 1) {
    //   setPanelIndex(0);
    //   return;
    // }

    console.log(
      //element,
      closeToBottom,
      element.scrollTop,
      element.clientHeight,
      element.scrollHeight
    );
  };

  const bottomSection = (
    <Paper sx={{ width: "100%", background: "white" }} elevation={0}>
      <ButtonDX
        fullWidth
        variant="text"
        sx={{ backgroundColor: "white", height: "45px" }}
        onClick={togglePanelIndex}
      >
        {panelIndex === 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </ButtonDX>
      <GridDX container sx={{ mx: 2 }}>
        <GridDX item xs={12}>
          {showTeleDoctorCard()}
        </GridDX>
        <GridDX item xs={12} sx={{ padding: 0 }}>
          {showMenuBoxes()}
        </GridDX>
      </GridDX>
    </Paper>
  );

  return (
    <>
      <AlertComponenet
        open={showAlert}
        alert="This provision not available for your Policy"
        handleClose={() => setShowAlert(false)}
      />

      <GridDX
        container
        sx={{
          width: "100%",
          alignContent: "flex-start",
          overflow: "auto",
        }}
        rowSpacing={2}
        //onScroll={handleScroll}
      >
        <GridDX container>
          <GridDX item xs={12} sx={{ height: 275, overflowX: "scroll" }}>
            <HorizontalScrollCardsDX loading={loading} cardsData={members} />
          </GridDX>
          <GridDX item xs={12} sx={{ justifyContent: "space-between" }}>
            <GridDX item xs={5}>
              <ButtonDX
                fullWidth
                color="success"
                onClick={() => navigate("/view-card")}
                style={{ borderRadius: "10px" }}
              >
                View Card
              </ButtonDX>
            </GridDX>
            <GridDX item xs={5}>
              <ButtonDX
                color="success"
                fullWidth
                style={{
                  color: "#007A48",
                  background: "transparent",
                  border: "1px solid #007A48",
                  boxShadow: "none",
                  borderRadius: "10px",
                }}
                onClick={() => navigate("/create-claim")}
              >
                Submit Claim
              </ButtonDX>
            </GridDX>
          </GridDX>
          <GridDX item xs={12} sx={{ overflowX: "auto", padding: 0 }}>
            {showMenuBoxes()}
          </GridDX>
          <GridDX item xs={12}>
            {showTeleDoctorCard()}
          </GridDX>
        </GridDX>
      </GridDX>
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          width: "100%",
          bottom: 0,
          left: 0,
        }}
      >
        <Collapse in={Boolean(panelIndex)} timeout={1000} collapsedSize={40}>
          {bottomSection}
        </Collapse>
      </div>
    </>
  );
};

export default Home;
