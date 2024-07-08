import "./App.css";
import "bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Feed from "./components/Feed/Feed";
import Inbox from "./components/Messages/Inbox";
import NavBar, { NavbarLayout } from "./components/Navbar/NavBar";
import { useState } from "react";
import Profile from "./components/Profile/Profile";
import SearchUsers from "./components/SearchUsers/SearchUsers";

function App() {
  const [navSize, setNavSize] = useState<boolean>(true);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<NavbarLayout defaultSize={navSize} />}>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  defaultSize
                  setNavSize={setNavSize}
                  element={<Feed />}
                />
              }
            />
            <Route
              path="/inbox/:chatId?"
              element={
                <ProtectedRoute
                  defaultSize={false}
                  setNavSize={setNavSize}
                  element={<Inbox />}
                />
              }
            ></Route>
            <Route
              path="/:username"
              element={
                <ProtectedRoute
                  defaultSize
                  setNavSize={setNavSize}
                  element={<Profile />}
                />
              }
            ></Route>
            <Route
              path="/search"
              element={
                <ProtectedRoute
                  defaultSize
                  setNavSize={setNavSize}
                  element={<SearchUsers />}
                />
              }
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
