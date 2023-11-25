import { Navigate } from "react-router-dom";
import { User } from "../types";

interface Protected {
  user: User | null;
  children: JSX.Element;
}

const ProtectedRoute = ({ user, children }: Protected) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;
