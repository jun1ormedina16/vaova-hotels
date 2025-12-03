import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { HotelsProvider } from "./context/HotelsContext";
import { ReservationsProvider } from "./context/ReservationsContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from "./pages/DashboardUser";
import DashboardHotel from "./pages/DashboardHotel";
import DashboardHotelReservations from "./pages/DashboardHotelReservations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <HotelsProvider>
        <ReservationsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard-user" element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <DashboardUser />
                </ProtectedRoute>
              }/>

              <Route path="/dashboard-hotel" element={
                <ProtectedRoute allowedRoles={["hotel"]}>
                  <DashboardHotel />
                </ProtectedRoute>
              }/>

              <Route path="/dashboard-hotel/reservations" element={
                <ProtectedRoute allowedRoles={["hotel"]}>
                  <DashboardHotelReservations />
                </ProtectedRoute>
              }/>

              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </ReservationsProvider>
      </HotelsProvider>
    </UserProvider>
  );
}

export default App;
