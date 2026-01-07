import { useEffect, useState } from "react";
import { CardContent, Collapse, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useOutletContext } from "react-router-dom";

import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import ButtonDX from "../../components/controls/buttondx";
import BoxDX from "../../components/layout/boxdx";
import GridDX from "../../components/layout/griddx";
import CardDX from "../../components/layout/carddx";
import CardButtonDX from "../../components/controls/cardbuttondx";
import AlertComponenet from "../../components/alerts/alert";
import { getMemberBenefits } from "../../shared/services/memberservice";

import TeleDoctorImage from "../../assets/tele_doctor_new.png";

import { getMembers } from "../../shared/services/memberservice";
import {
  openMedIQUrl,
  requestCameraStoragePermissionFromDevice,
  requestLocationPermissionFromDevice,
} from "../../shared/globals";
import PhysicalCardFront from "../../components/business/physicalcardfront";
import Table from "../../components/layout/tabledx";
import MemberSelector from "../../components/business/memberselector";
import MemberCard from "../../components/controls/membercard";
import CoverageTable from "../../components/business/coveragetable";

import BenefitsAndLimits from "../../assets/iconsBackground/BenefitsAndLimits.png";
import ClaimHistory from "../../assets/iconsBackground/ClaimHistory.png";
import ClaimReimbursement from "../../assets/iconsBackground/ClaimReimbursement.png";
import Helpline from "../../assets/iconsBackground/Helpline.png";
import RecordCorrection from "../../assets/iconsBackground/RecordCorrection.png";
import TakafulProduct from "../../assets/iconsBackground/TakafulProduct.png";
import ValueAddedServices from "../../assets/iconsBackground/ValueAddedServices.png";
import TeleDoc_2 from "../../assets/icons/TeleDoc_2.png";

import PendingClaims from "../../assets/iconsBackground/PendingClaims.png";
import PanelHospital from "../../assets/iconsBackground/PanelHospital.png";
import TreamentInfo from "../../assets/iconsBackground/TreamentInfo.png";
import OpdReimbursement from "../../assets/iconsBackground/OpdReimbursement.png";
import LaunchComplaint from "../../assets/iconsBackground/LaunchComplaint.png";
import Pre_Authorization from "../../assets/iconsBackground/Pre_Authorization.png";
import pak_qatar_semi_circle_logo_2 from "../../assets/pak_qatar_semi_circle_logo_2.png";
import Elaaj_App_Screen from "../../assets/Elaaj_App_Screen.jpg";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getUserDetails, getToken } = useAuthContext();
  const { setError } = useErrorContext();
  const isBottom = useOutletContext();

  const cardMenus = [
    {
      icon: (
        <img
          src={BenefitsAndLimits}
          style={{ width: "65px", height: "65px" }}
        />
      ),
      label: "Benefits & Limits",
      link: "/benefits-limits",
    },
    {
      icon: (
        <img src={ClaimHistory} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Claim History",
      link: "/claim-history",
    },
    {
      icon: (
        <img src={PendingClaims} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Pending Claims",
      link: "/pending-claims",
    },
    {
      icon: (
        <img
          src={ClaimReimbursement}
          style={{ width: "65px", height: "65px" }}
        />
      ),
      label: "Submit Claim",
      link: "/create-claim",
    },
    {
      icon: (
        <img src={RecordCorrection} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Record Correction",
      link: "/record-correction",
    },
    {
      icon: (
        <img src={PanelHospital} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Panel Hospital",
      link: "/panel-hospitals",
    },
    {
      icon: (
        <img
          src={ValueAddedServices}
          style={{ width: "65px", height: "65px" }}
        />
      ),
      label: "Value Added Services",
      link: "/value-added-services",
    },
    // {
    //   icon: (
    //     <img src={TreamentInfo} style={{ width: "65px", height: "65px" }} />
    //   ),
    //   label: "Treatment Info",
    //   link: "",
    // },
    {
      icon: (
        <img src={TakafulProduct} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Takaful Products & Solutions",
      link: "/products-solutions",
    },
    // {
    //   icon: (
    //     <img src={OpdReimbursement} style={{ width: "65px", height: "65px" }} />
    //   ),
    //   label: "OPD Reimbursement",
    //   link: "/opd-reimburse",
    // },
    {
      icon: (
        <img src={LaunchComplaint} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Launch Complaint",
      link: "/launch-complaint",
    },
    {
      icon: <img src={Helpline} style={{ width: "65px", height: "65px" }} />,
      label: "24/7 Helpline",
      link: "/contact-us",
    },
    {
      icon: (
        <img src={OpdReimbursement} style={{ width: "65px", height: "65px" }} />
      ),
      label: "Submit Pre authorization",
      link: "/preauthorization",
    },

    // {
    //   icon: <img src={TeleDoc_2} style={{ width: "65px", height: "65px" }} />,
    //   label: "Tele-Doc",
    //   link: "/teledoc",
    // },
  ];
  const [panelIndex, setPanelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showCashLessOPDBtn, setShowCashLessOPDBtn] = useState(false);
  const [member, setMember] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [coverageData, setCoverageData] = useState<any>();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    requestLocationPermissionFromDevice();
    requestCameraStoragePermissionFromDevice();

    getUserDetails().then((data: any) => {
      const token = getToken();
      getMembers(data.policyNumber, data.employeeCode, token)
        .then((members: any) => {
          setMembers(members);
          setMember(
            members.filter(
              (x: any) => x.employeeSRNumber === data.certNumber
            )[0]
          );

          setFamilyMembers(
            members.filter((x: any) => x.employeeSRNumber !== data.certNumber)
          );
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));

      const win: any = window;
      if (data.cashLessOPD === "Y" && win?.ReactNativeWebView) {
        setShowCashLessOPDBtn(true);
      }
    });
  }, [getUserDetails, getToken, setError]);

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
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          my: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <GridDX
          container
          sx={{ width: "100%" }}
          rowSpacing={2}
          columnSpacing={4}
        >
          {cardMenus.map((menu: any, i: number) => (
            <GridDX item xs={4} md={2}>
              <CardButtonDX
                sx={{ mb: "20px" }}
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
            </GridDX>
          ))}
        </GridDX>
      </BoxDX>
    );
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bottomSection = (
    <Paper
      sx={{
        width: "100%",
        background: "white",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        backgroundImage: isDesktop
          ? `url(${pak_qatar_semi_circle_logo_2})`
          : `url(${Elaaj_App_Screen})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      elevation={0}
    >
      <ButtonDX
        fullWidth
        variant="text"
        sx={{
          backgroundColor: panelIndex === 0 ? "white" : "transparent",
          height: "45px",
        }}
        onClick={togglePanelIndex}
      >
        {panelIndex === 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </ButtonDX>
      <GridDX container sx={{ mx: 0, my: 0 }}>
        <GridDX item xs={12} sx={{ padding: 0 }}>
          {showMenuBoxes()}
        </GridDX>
      </GridDX>
    </Paper>
  );

  const onMemberChange = (membersIndex: any) => {
    setSelectedIndex(membersIndex);
  };

  useEffect(() => {
    if (selectedIndex > -1 && members[selectedIndex]) {
      setLoadingDetails(true);
      const token = getToken();
      getMemberBenefits(
        members[selectedIndex].policyNumber,
        members[selectedIndex].employeeSRNumber,
        token
      )
        .then((resp) => {
          setCoverageData(resp);
        })
        .catch((err) => setError(err))
        .finally(() => setLoadingDetails(false));
    }
  }, [selectedIndex, members]);

  return (
    <>
      <AlertComponenet
        open={showAlert}
        alert="This provision not available for your Policy"
        handleClose={() => setShowAlert(false)}
      />
      <BoxDX sx={{ pl: "1%" }}>
        <PhysicalCardFront
          loading={loading}
          member={member}
          familyMembers={familyMembers}
        />
      </BoxDX>
      <GridDX
        container
        sx={{
          width: "100%",
          alignContent: "flex-start",
          padding: "0% 5% 5% 1%",
          marginTop: -110,
        }}
      >
        <GridDX item xs={12}>
          <MemberSelector
            loading={loading}
            list={members}
            handleCallBack={onMemberChange}
          />
        </GridDX>
        <GridDX item xs={12} sx={{ marginTop: "27px" }}>
          <MemberCard member={members[selectedIndex]} loading={loading} />
        </GridDX>
        <GridDX item xs={12} sx={{ justifyContent: "space-between" }}>
          {showCashLessOPDBtn && (
            <GridDX item xs={4}>
              <ButtonDX
                fullWidth
                color="success"
                onClick={async () => {
                  const userDetails = await getUserDetails();
                  openMedIQUrl(
                    JSON.stringify({
                      policyNumber: userDetails.policyNumber,
                      employeeCode: userDetails.employeeCode,
                      employeeSRNumber: userDetails.certNumber,
                      employeeName: userDetails?.employeeName,
                      mobileNumber: userDetails?.mobileNumber,
                      emailAddress: userDetails?.emailAddress,
                      customerCode: userDetails?.customerCode,
                      customerName: userDetails?.customerFullName,
                      branchId: userDetails?.branchID,
                    })
                  );
                }}
                style={{ borderRadius: "10px" }}
              >
                Cash less OPD
              </ButtonDX>
            </GridDX>
          )}
        </GridDX>

        <GridDX item xs={12} sx={{ mt: "20px", mb: "6px" }}>
          <CoverageTable
            data={coverageData}
            loading={loading || loadingDetails}
          />
        </GridDX>
        <GridDX item xs={12} sx={{ pb: "10%" }}>
          <Table data={familyMembers} />
        </GridDX>
      </GridDX>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <Collapse
          in={Boolean(panelIndex)}
          timeout={1000}
          collapsedSize={40}
          orientation="vertical"
          style={{ marginBottom: "55px" }}
        >
          {bottomSection}
        </Collapse>
      </div>
    </>
  );
};

export default Home;
