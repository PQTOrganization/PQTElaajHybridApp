import "./App.css";
import "react-loading-skeleton/dist/skeleton.css";

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { AuthProvider, useAuthContext } from "./context/authcontext";
import { ErrorContextProvider } from "./context/errorcontext";

import AccountTemplate from "./templates/accounttemplate";
import MarketingTemplate from "./templates/marketingtemplate";
import DashboardTemplate from "./templates/dashboardtemplate";
import SecondaryPageTemplate from "./templates/secondarypagetemplate";

import MarketingSlides from "./pages/marketing/marketingslides";
import SignIn from "./pages/account/signin";
import ForgetPassword from "./pages/account/forgetpassword";
import Hotline from "./pages/account/hotline";

import Home from "./pages/dashboard/home";
import Claims from "./pages/dashboard/claims";
import PanelHospitals from "./pages/dashboard/panelhospitals";
import Call from "./pages/dashboard/call";

import ClaimHistory from "./pages/claims/claim-history";
import CreateClaim from "./pages/claims/create-claim";
import PendingClaims from "./pages/claims/pending-claims";
import BenefitsLimits from "./pages/benefits-limits";
import ContactUs from "./pages/contact-us";
import LaunchComplaint from "./pages/complaint/launchcomplaint";
import PreAuthorization from "./pages/claims/preauthorize";
import ProductsSolutions from "./pages/products-solutions";
import RecordCorrection from "./pages/record-correction";
import TeleDoctor from "./pages/tele-doctor";
import ValueAddedServices from "./pages/value-added-services";
import ViewCard from "./pages/view-card";
import Notifications from "./pages/notifications";
import Profile from "./pages/profile";
import OPDReimburese from "./pages/claims/opd-reimburse";
import ManageComplaint from "./pages/complaint/managecomplaint";

import Loading from "./components/loading";
import ProtectedRoute from "./components/route/proetectedroute";

import { getMarketingSlides } from "./shared/services/commonservice";
import { saveFirebaseTokenToDB } from "./shared/services/firebaseservice";
import Api from "./shared/api/api";
import DownloadPage from "./pages/download";
import WebPage from "./pages/webpage";
import WebPageViewTemplate from "./templates/webpageviewtemplates";

import { useConfigContext } from "./context/configcontext";
import Registration from "./pages/account/registration";
import Verification from "./pages/verification";
import TeleDoc from "./pages/teledoc";

const App = () => {
  const { configLoaded } = useConfigContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (configLoaded) getMarketingSlides().finally(() => setLoading(false));
  }, [configLoaded]);

  if (loading) return <Loading />;
  else
    return (
      <ErrorContextProvider>
        <AuthProvider>
          <Router>
            <ApplicationRoutes />
          </Router>
        </AuthProvider>
      </ErrorContextProvider>
    );
};

const ApplicationRoutes = () => {
  const navigate = useNavigate();

  const { isLoggedIn, getUserDetails } = useAuthContext();

  const [allowBack, setAllowBack] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    document.addEventListener("message", messageFromApp, false);
    document.addEventListener("goBack", goBack, false);
    document.addEventListener("firebaseToken", saveFirebaseToken);
    document.addEventListener("refreshNotification", getNotificationCount);
    document.addEventListener("openNotification", () =>
      navigate("/menu/notifications")
    );

    return () => {
      document.removeEventListener("message", messageFromApp, false);
      document.removeEventListener("goBack", goBack, false);

      document.addEventListener("firebaseToken", saveFirebaseToken);
      document.addEventListener("refreshNotification", getNotificationCount);
      document.addEventListener("openNotification", () =>
        navigate("/menu/notifications")
      );
    };
  }, []);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const messageFromApp = async (messageFromSite: any) => {
    const message = JSON.parse(messageFromSite.data);

    switch (message.key) {
      case "firebaseToken":
        document.dispatchEvent(
          new CustomEvent("firebaseToken", { detail: message.data })
        );
        break;
      case "GoBack":
        document.dispatchEvent(new CustomEvent("goBack", { detail: "" }));
        break;
      case "refreshNotification":
        document.dispatchEvent(
          new CustomEvent("refreshNotification", { detail: "" })
        );
        break;
      case "openNotification":
        await delay(2000);
        document.dispatchEvent(
          new CustomEvent("openNotification", { detail: "" })
        );
        break;
      case "uploadAction":
        document.dispatchEvent(
          new CustomEvent("uploadAction", { detail: message.data })
        );
        break;
      default:
        console.log(message.data);
    }
  };

  const goBack = () => {
    if (allowBack) navigate(-1);
    setAllowBack(false);
    setTimeout(() => setAllowBack(true), 1500);
  };

  const saveFirebaseToken = async (event: any) => {
    const userDetails = await getUserDetails();

    if (userDetails && userDetails.userId)
      saveFirebaseTokenToDB(userDetails.userId, event.detail, "");
  };

  const getNotificationCount = async () => {
    try {
      var response = await Api("usernotifications/unread", "GET", "");
      setNotificationCount(response.notificationCount);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <Routes>
      <Route element={<MarketingTemplate />}>
        <Route path="/" element={<MarketingSlides />} />
      </Route>

      {/* <Route path="/" element={<SignIn />} /> */}
      <Route element={<AccountTemplate />}>
        {/* <Route path="/hotline" element={<Hotline />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/verification" element={<Verification />} />
      </Route>

      <Route element={<DownloadPage />} path="/download" />

      <Route
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <DashboardTemplate />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/panel-hospitals" element={<PanelHospitals />} />
        <Route path="/call" element={<Call />} />
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <SecondaryPageTemplate />
          </ProtectedRoute>
        }
      >
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/claim-history" element={<ClaimHistory />} />
        <Route path="/create-claim" element={<CreateClaim />} />
        <Route path="/pending-claims" element={<PendingClaims />} />
        <Route path="/benefits-limits" element={<BenefitsLimits />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/launch-complaint" element={<LaunchComplaint />} />
        <Route path="/manage-complaint" element={<ManageComplaint />} />
        <Route path="/preauthorization" element={<PreAuthorization />} />
        <Route path="/products-solutions" element={<ProductsSolutions />} />
        <Route path="/record-correction" element={<RecordCorrection />} />
        <Route path="/tele-doctor" element={<TeleDoctor />} />
        <Route path="/value-added-services" element={<ValueAddedServices />} />
        <Route path="/view-card" element={<ViewCard />} />
        <Route path="/opd-reimburse" element={<OPDReimburese />} />
        <Route path="/teledoc" element={<TeleDoc />} />
      </Route>

      <Route
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <WebPageViewTemplate />
          </ProtectedRoute>
        }
      >
        <Route path="/webpage" element={<WebPage />} />
      </Route>
    </Routes>
  );
};

export default App;
