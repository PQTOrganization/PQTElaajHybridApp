import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }: any) => {
  if (!isLoggedIn) {
    return <Navigate to={"/signin"} replace />;
  }

  return children;
};

export default ProtectedRoute;
