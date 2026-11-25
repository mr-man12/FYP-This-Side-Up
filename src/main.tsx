import React from "react";
import ReactDOM from "react-dom/client";
import TestDashboardPage from "./routes/index";
import { AuthProvider } from "./lib/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <TestDashboardPage />
    </AuthProvider>
  </React.StrictMode>
);
