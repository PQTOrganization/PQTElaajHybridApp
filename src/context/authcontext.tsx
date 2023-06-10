import React, { createContext, useContext } from "react";
import { ReactNode } from "react";

const AuthContext = createContext<any | null>(null);
const useAuthContext = () => useContext(AuthContext);

interface AuxProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuxProps) => {
  const sessionName = "userelaajSession";
  const rememberMeSessionName = "elaajRememberMe";

  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLogedIn: true,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isLoggedIn: true,
            userData: action.userData,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isLoggedIn: false,
            userData: null,
            userToken: null,
            discrepantData: null,
          };

        case "SET_ACCOUNT_LEVEL":
          return {
            ...prevState,
            userAccountLevel: action.payload,
          };

        case "SET_DISCREPANT_DATA":
          return {
            ...prevState,
            discrepantData: action.payload,
          };

        case "SET_DEVICE_SOURCE":
          return {
            ...prevState,
            deviceSource: action.payload,
          };
      }
    },
    {
      isLoggedIn: false,
      userData: null,
      userToken: null,
      userAccountLevel: 0,
      discrepantData: null,
      deviceSource: "",
    }
  );

  const signIn = async (data: any, token: string, signInData: any) => {
    const encodedToken = window.btoa(token);

    localStorage.setItem(
      sessionName,
      JSON.stringify({ ...data, token: encodedToken })
    );

    dispatch({
      type: "SIGN_IN",
      userData: data.UserSession,
      token: encodedToken,
    });

    if (signInData.rememberMe)
      localStorage.setItem(
        rememberMeSessionName,
        JSON.stringify({
          userName: signInData.userName,
          password: window.btoa(signInData.password),
        })
      );
    else localStorage.removeItem(rememberMeSessionName);

    console.log("data", data);
  };

  const signOut = () => {
    localStorage.removeItem(sessionName);
    dispatch({ type: "SIGN_OUT" });
  };

  const getToken = () => {
    return window.atob(state.userToken);
  };

  const getUserDetails = async () => {
    const sessionInfo = localStorage.getItem(sessionName);

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);
        return sessionInfoJSON;
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  const removeUserData = async () => {
    localStorage.removeItem(sessionName);
  };

  const rememberMeData = async () => {
    const rememberMeInfo = localStorage.getItem(rememberMeSessionName);

    if (rememberMeInfo && rememberMeInfo.length > 0) {
      try {
        const rememberMeInfoJSON = JSON.parse(rememberMeInfo);
        return {
          ...rememberMeInfoJSON,
          password: window.atob(rememberMeInfoJSON.password),
        };
      } catch (ex) {
        console.log("Error parsing remember me info:", ex);
        return null;
      }
    } else return null;
  };

  const isAdminUser = () => {
    const sessionInfo = localStorage.getItem(sessionName);

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);
        return sessionInfoJSON.role === "admin";
      } catch (ex) {
        console.log("Error parsing session info:", ex);
      }
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: state.isLoggedIn,
        signIn,
        signOut,
        getToken,
        getUserDetails,
        removeUserData,
        rememberMeData,
        isAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
