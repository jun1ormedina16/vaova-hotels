import { createContext, useContext, useState, useEffect } from "react";

const HotelsContext = createContext();
export const useHotels = () => useContext(HotelsContext);

export const HotelsProvider = ({ children }) => {
  const [hotels, setHotels] = useState(() => {
    const stored = localStorage.getItem("hotels");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("hotels", JSON.stringify(hotels));
  }, [hotels]);

  const addHotel = (hotel) => {
    setHotels(prev => [...prev, hotel]);
  };

  const updateHotel = (id, updated) => {
    setHotels(prev => prev.map(h => h.id === id ? updated : h));
  };

  const deleteHotel = (id) => {
    setHotels(prev => prev.filter(h => h.id !== id));
  };

  return (
    <HotelsContext.Provider value={{ hotels, addHotel, updateHotel, deleteHotel }}>
      {children}
    </HotelsContext.Provider>
  );
};
