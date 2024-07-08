import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { refresh } from "../features/authSlice";
import { Spinner } from "react-bootstrap";
import NavBar from "./Navbar/NavBar";
// import "../App.css";
interface Protected {
  element: JSX.Element;
  setNavSize: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSize: boolean;
}

const ProtectedRoute = ({
  element,
  setNavSize,
  defaultSize = true,
}: Protected) => {
  const dispatch = useAppDispatch();
  const userAuthExp = useAppSelector((state) => state.auth.authExp);
  const user = useAppSelector((state) => state.auth.User);
  const [isRendered, setIsRendered] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    setNavSize(defaultSize);
    const checkAuth = async () => {
      if (userAuthExp && userAuthExp < new Date(Date.now()).getTime()) {
        await dispatch(refresh());
        setIsRendered(element);
      } else {
        setIsRendered(element);
      }
    };

    checkAuth();
  }, [element]);

  if (isRendered !== element) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
        }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <div>{element}</div>;
};
export default ProtectedRoute;
