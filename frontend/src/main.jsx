import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store/store.js";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store/store.js";
import { SearchProvider } from "./context/SearchContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <SearchProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SearchProvider>
    </PersistGate>
  </Provider>
);