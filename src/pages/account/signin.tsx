import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
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
          intimateDeviceForFBSetup();
          navigate("/home", { replace: true });
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formValues.userName.length === 0)
      newErrors["userName"] = "User ID is required.";

    if (formValues.password.length === 0)
      newErrors["password"] = "Password is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <GridDX container sx={{ width: "100%", height: "100%" }} rowSpacing={2}>
      <GridDX item xs={12} justifyContent="center" sx={{ minHeight: 190 }}>
        <img src={ElaajLogo} alt="Elaaj Logo" width={175} />
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <Typography color="primary" sx={{ fontSize: 28, fontWeight: "bold" }}>
          Sign In
        </Typography>
      </GridDX>
      <GridDX item xs={12} justifyContent="center" sx={{ mt: 2, mb: 1 }}>
        <TextFieldDX
          name="userName"
          label={"User ID | CNIC"}
          type="number"
          value={formValues.userName}
          onChange={handleInputChange}
          errorText={errors["userName"]}
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
          fullWidth
          onClick={onLoginClick}
          loading={isLoading}
          sx={{ mt: 4 }}
        >
          Sign In
        </LoadingButtonDX>
      </GridDX>
      <GridDX item xs={12} justifyContent="flex-end">
        <ButtonDX
          variant="text"
          sx={{ mb: 4 }}
          onClick={() => navigate("/forgetpassword")}
        >
          Forget Password?
        </ButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default SignIn;
