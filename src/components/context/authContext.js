import { createContext, useEffect, useState } from "react";

// Create a context for user authentication
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [financeDetailsData, setFinanceDetailsData] = useState({ finance: "finance" });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("values"));
    setUser(userData);
  }, []);

  const loginUser = (userEmail) => {
    localStorage.setItem("values", JSON.stringify(userEmail));
    setUser(userEmail);
  };

  const logoutUser = () => {
    localStorage.removeItem("values");
    setUser(null);
  };



  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, financeDetailsData, setFinanceDetailsData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
