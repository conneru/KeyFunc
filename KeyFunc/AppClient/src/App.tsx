import "./App.css";
import "bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Feed from "./components/Feed/Feed";
import Chat from "./components/Chat/Chat";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute navBarDefault element={<Feed />} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute navBarDefault={false} element={<Chat />} />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
