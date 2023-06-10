import Api from "../api/api";

export const login = async (userName: string, password: string) => {
  var route = "Account/Login";
  var body = {
    userName: userName,
    password: password,
  };

  var Data = await Api(route, body, "POST");
  return Data;
};

export const forgetPassword = async (userName: string) => {
  var route = "Account/ForgetPassword";
  var body = {
    userName: userName,
  };

  var Data = await Api(route, body, "POST");
  return Data;
};
