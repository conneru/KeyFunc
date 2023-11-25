import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Home from "./components/Home";
import { useAppDispatch, useAppSelector } from "./hooks";
import { refresh } from "./features/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.persist.User);
  const userAuthExp = useAppSelector((state) => state.persist.authExp);

  useEffect(() => {
    if (userAuthExp && userAuthExp < new Date(Date.now()).getTime()) {
      dispatch(refresh());
    }
  }, [dispatch, user, userAuthExp]);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          path="/"
          element={<ProtectedRoute user={user} children={<Home />} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
