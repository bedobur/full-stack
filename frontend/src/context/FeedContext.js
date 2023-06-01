import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FeedContext = createContext();

export function useFeedContext() {
  return useContext(FeedContext);
}

function FeedProvider({ children }) {
  const { isAuth } = useAuth();
  const [{ tabName, categoryName }, setTab] = useState({
    tabName: isAuth ? "matched" : "global",
    categoryName: "",
  });

  useEffect(() => {
    setTab((tab) => ({ ...tab, tabName: isAuth ? "matched" : "global" }));
  }, [isAuth]);

  const changeTab = async (e, tabName) => {
    const categoryName = e.target.innerText.trim();

    setTab({ tabName, categoryName });
  };

  return (
    <FeedContext.Provider value={{ changeTab, tabName, categoryName }}>
      {children}
    </FeedContext.Provider>
  );
}

export default FeedProvider;
