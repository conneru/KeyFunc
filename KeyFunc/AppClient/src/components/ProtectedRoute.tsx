import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { refresh } from "../features/authSlice";
import { Spinner } from "react-bootstrap";
import NavBar from "./Navbar/NavBar";

interface Protected {
  element: JSX.Element;
  navBarDefault: boolean;
}

const ProtectedRoute = ({ element, navBarDefault = true }: Protected) => {
  const dispatch = useAppDispatch();
  const userAuthExp = useAppSelector((state) => state.auth.authExp);
  const user = useAppSelector((state) => state.auth.User);
  const [isRendered, setIsRendered] = useState<React.ReactNode | null>(null);

  useEffect(() => {
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
      <div>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: "flex" }}>
      <NavBar defaultSize={navBarDefault} />

      {element}
    </div>
  );
};
export default ProtectedRoute;
