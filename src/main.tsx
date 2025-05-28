import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { StatsProvider } from "@/contexts/StatsContext";
const rootElement = document.getElementById("root")

createRoot(rootElement!).render(
  //<StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StatsProvider>
          <App />
        </StatsProvider>
      </AuthProvider>
    </BrowserRouter>
  //</StrictMode>
);