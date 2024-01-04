import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/es/integration/react";
import { Spinner } from "react-bootstrap";
import { setupAxiosInstance } from "./axiosInstance";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
setupAxiosInstance(store);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <App />
    </PersistGate>
  </Provider>
);
