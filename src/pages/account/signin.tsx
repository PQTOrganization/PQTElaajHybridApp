import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GridDX from "../../components/layout/griddx";
import ElaajLogo from "../../assets/elaaj_logo.png";
import TextFieldDX from "../../components/controls/textfielddx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import { login } from "../../shared/services/accountservice";
import ButtonDX from "../../components/controls/buttondx";
import { intimateDeviceForFBSetup } from "../../shared/globals";
import CheckBoxDX from "../../components/controls/checkboxdx";
import Hotline from "./hotline";
import MobileEmailAddressInputPopup from "../../components/business/mobileemailaddressinputpopup";

const SignIn = () => {
  const navigate = useNavigate();

  const { setError } = useErrorContext();
  const { signIn, rememberMeData } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    userName: "",
    password: "",
    rememberMe: false,
  };

  const [formValues, setFormValues] = useState<any>(defaultValues);
  const [errors, setErrors] = useState<any>({});
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [popupUser, setPopupUser] = useState(null);

  useEffect(() => {
    rememberMeData().then((data: any) => {
      if (data) {
        setFormValues({
          userName: data.userName,
          password: data.password,
          rememberMe: true,
        });
      }
    });
  }, []);

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

  const handleRemeberMeChange = (e: any) => {
    setFormValues({
      ...formValues,
      rememberMe: e.target.checked,
    });
  };

  const onLoginClick = () => {
    if (validateForm()) {
      setIsLoading(true);
      login(formValues.userName, formValues.password)
        .then((response) => {
          signIn(response.userInfo, response.tokenInfo.token, formValues);
          setPopupUser(response.userInfo);
          intimateDeviceForFBSetup();

          let showDetailsPopup =
            response.userInfo.isContactInfoVerified === false;
          setShowDetailsPopup(showDetailsPopup);
          if (!showDetailsPopup) {
            navigate("/home", {
              replace: true,
              state: { showDetailsPopup: showDetailsPopup },
            });
          }
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    }
  };

  const onSave = () => {
    navigate("/home");
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formValues.userName.length === 0)
      newErrors["userName"] = "User ID is required.";
    else if (formValues.userName.length > 13)
      newErrors["userName"] = "User ID cannot exceed 13 characters";
    else if (formValues.userName.length < 13)
      newErrors["userName"] = "User ID cannot be less 13 characters";

    if (formValues.password.length === 0)
      newErrors["password"] = "Password is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" && validateForm()) {
      onLoginClick();
    }
  };
  return (
    <>
      <MobileEmailAddressInputPopup
        show={showDetailsPopup}
        setshow={setShowDetailsPopup}
        user={popupUser}
      />
      <GridDX
        container
        sx={{
          mt: "200px",
          padding: "5px",
          maxWidth: 700,
          minHeight: "100%",
        }}
        rowSpacing={1}
        onKeyPress={handleKeyPress}
      >
        <GridDX item xs={12} justifyContent="center" sx={{ height: 120 }}>
          <img src={ElaajLogo} alt="Elaaj Logo" width={100} height={100} />
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          {/* <Typography color="primary" sx={{ fontSize: 28, fontWeight: "bold" }}>
          Sign In
        </Typography> */}
        </GridDX>
        <GridDX item xs={12} justifyContent="center" sx={{ mt: 2, mb: 1 }}>
          <TextFieldDX
            name="userName"
            label={"Username"}
            type="number"
            value={formValues.userName}
            onChange={handleInputChange}
            errorText={errors["userName"]}
            variant="standard"
            InputLabelProps={{
              sx: {
                color: "#8B0037",
                textAlign: "center",
                width: "100%",
                transformOrigin: "top",
              },
            }}
            sx={{
              "& .MuiInput-underline:before": {
                borderBottom: "2px solid #8B0037 !important",
              },
            }}
          />
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          <TextFieldDX
            name="password"
            type="password"
            label="Password"
            value={formValues.password}
            onChange={handleInputChange}
            errorText={errors["password"]}
            variant="standard"
            sx={{
              "& .MuiInput-underline:before": {
                borderBottom: "2px solid #8B0037 !important",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#8B0037",
                textAlign: "center",
                width: "100%",
                transformOrigin: "top",
              },
            }}
          />
        </GridDX>
        <GridDX item xs={12}>
          <CheckBoxDX
            label="Remember Me"
            checked={formValues.rememberMe}
            onChange={handleRemeberMeChange}
          />
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          <LoadingButtonDX
            onClick={onLoginClick}
            loading={isLoading}
            sx={{
              mt: 1,
              backgroundColor: "green !important",
              width: "190px",
              borderRadius: "50px",
            }}
          >
            Login
          </LoadingButtonDX>
        </GridDX>
        {/* <GridDX item xs={6}>
          <ButtonDX
            variant="text"
            sx={{ mb: 4 }}
            onClick={() => navigate("/register")}
          >
            Registration
          </ButtonDX>
        </GridDX> */}
        <GridDX item xs={12} justifyContent="center">
          <ButtonDX
            variant="text"
            sx={{ mb: 4 }}
            onClick={() => navigate("/forgetpassword")}
          >
            Forgot Password?
          </ButtonDX>
        </GridDX>
        <GridDX item xs={12} sx={{ alignItems: "center" }}>
          <Hotline />
        </GridDX>
      </GridDX>
    </>
  );
};

export default SignIn;
