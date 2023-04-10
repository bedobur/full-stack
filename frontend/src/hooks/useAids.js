import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import getAids from "../services/getAids";

function useAids({ location, tabName, categoryName, username }) {
  const [{ aids, aidsCount }, setAidsData] = useState({
    aids: [],
    aidsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { headers } = useAuth();

  useEffect(() => {
    if (!headers && tabName === "feed") return;

    setLoading(true);

    getAids({ headers, location, tabName, categoryName, username })
      .then(setAidsData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [headers, location, tabName, categoryName, username]);

  return { aids, aidsCount, loading, setAidsData };
}

export default useAids;
