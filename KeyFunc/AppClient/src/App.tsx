import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FetchData from "./components/FetchData";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FetchData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
