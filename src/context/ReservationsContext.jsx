import { createContext, useContext, useState } from "react";
import { useHotels } from "./HotelsContext";

const ReservationsContext = createContext();
export const useReservations = () => useContext(ReservationsContext);

export const ReservationsProvider = ({ children }) => {
  const { hotels, updateHotel } = useHotels();
  const [reservations, setReservations] = useState(() => {
    const stored = localStorage.getItem("reservations");
    return stored ? JSON.parse(stored) : [];
  });

  const saveReservations = (res) => {
    setReservations(res);
    localStorage.setItem("reservations", JSON.stringify(res));
  };

  const addReservation = (res) => {
    const newRes = [...reservations, res];
    saveReservations(newRes);
  };

  const updateReservation = (id, updated) => {
    const newRes = reservations.map(r => r.id === id ? updated : r);
    saveReservations(newRes);
  };

  const deleteReservation = (id) => {
    const resToDelete = reservations.find(r => r.id === id);
    if (!resToDelete) return;

    // Devolver habitaciones al hotel
    const hotel = hotels.find(h => h.id === resToDelete.hotelId);
    if (hotel) {
      updateHotel(hotel.id, {
        ...hotel,
        rooms: {
          ...hotel.rooms,
          [resToDelete.roomType]: hotel.rooms[resToDelete.roomType] + resToDelete.quantity
        }
      });
    }

    saveReservations(reservations.filter(r => r.id !== id));
  };

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, updateReservation, deleteReservation }}>
      {children}
    </ReservationsContext.Provider>
  );
};
