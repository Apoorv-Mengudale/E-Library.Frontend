import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  if (JSON.parse(sessionStorage.getItem("user")) != null) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default RequireAuth;
