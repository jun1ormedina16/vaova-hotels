import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { HotelsProvider } from "./context/HotelsContext";
import { ReservationsProvider } from "./context/ReservationsContext";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Optional: Bootstrap JS for modals, dropdowns, etc.
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import Google Fonts (Montserrat y Lato para premium look)
const linkMontserrat = document.createElement("link");
linkMontserrat.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap";
linkMontserrat.rel = "stylesheet";
document.head.appendChild(linkMontserrat);

const linkLato = document.createElement("link");
linkLato.href = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap";
linkLato.rel = "stylesheet";
document.head.appendChild(linkLato);

// Aplicar tipografía global premium
const globalStyles = document.createElement("style");
globalStyles.innerHTML = `
  body {
    font-family: 'Lato', sans-serif;
    background-color: #f8f9fa;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
  }
`;
document.head.appendChild(globalStyles);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <HotelsProvider>
        <ReservationsProvider>
          <App />
        </ReservationsProvider>
      </HotelsProvider>
    </UserProvider>
  </React.StrictMode>
);
