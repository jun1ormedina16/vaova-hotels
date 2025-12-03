import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    else sessionStorage.removeItem("user");
  }, [user]);

  const registerUser = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === data.email)) return { error: "Email ya registrado" };
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(data);
    return { success: true, user: data };
  };

  const loginUser = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: "Email o contraseña incorrectos" };
    setUser(found);
    return { success: true, user: found };
  };

  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
