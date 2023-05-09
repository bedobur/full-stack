import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import getAids from "../services/getAids";

function useAids({ location, tabName, categoryName, username }) {
  const [{ aids, aidsCount }, setAidsData] = useState({
    aids: [],
    aidsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { headers } = useAuth();

  useEffect(() => {
    if (!headers && tabName === "feed") return;

    setLoading(true);

    getAids({ headers, location, tabName, categoryName, username })
      .then(setAidsData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [headers, location, tabName, categoryName, username]);

  const searchAids = (query) => {
    setSearchQuery(query);
  };

  const filteredAids = aids.filter((aid) =>
    aid.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { aids: filteredAids, aidsCount, loading, setAidsData, searchAids };
}

export default useAids;
