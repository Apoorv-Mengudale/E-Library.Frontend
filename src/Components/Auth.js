import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const userObject = {
  Id: 0,
  FirstName: "",
  LastName: "",
  Username: "",
  Token: "",
  Role: "",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userObject);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const login = (user) => {
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };
  const logout = () => {
    setUser(userObject);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
