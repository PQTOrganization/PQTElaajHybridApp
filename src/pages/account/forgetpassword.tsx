import { useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import GridDX from "../../components/layout/griddx";
import ElaajLogo from "../../assets/elaaj_logo.png";
import TextFieldDX from "../../components/controls/textfielddx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";

import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import { forgetPassword } from "../../shared/services/accountservice";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const { setError, setInfo } = useErrorContext();

  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    userName: "",
  };

  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState<any>({});

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

  const onSendClick = () => {
    if (validateForm()) {
      setIsLoading(true);
      forgetPassword(formValues.userName)
        .then((response) => {
          if (response.errorNumber === 0) setError(response.message);
          else {
            setInfo(response.message);
            navigate("/");
          }
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formValues.userName.length === 0)
      newErrors["userName"] = "User ID is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={2}>
      <GridDX item xs={12} justifyContent="center">
        <img src={ElaajLogo} alt="Elaaj Logo" width={175} />
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <Typography color="primary" sx={{ fontSize: 28, fontWeight: "bold" }}>
          Forgot Password
        </Typography>
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
          Please provide User ID | CNIC of the account for which you want the
          password to be reset.
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
          variant="standard"
          sx={{ borderBottom: "1px solid #8B0037" }}
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
      <GridDX item xs={12} justifyContent="center">
        <LoadingButtonDX
          fullWidth
          onClick={onSendClick}
          loading={isLoading}
          sx={{ my: 4 }}
        >
          Continue
        </LoadingButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default ForgetPassword;
