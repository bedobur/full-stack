import { useState } from "react";
import AidsPagination from "../components/AidsPagination";
import AidsPreview from "../components/AidsPreview";
import { useFeedContext } from "../context/FeedContext";
import useAidList from "../hooks/useAids";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}

function HomeAids() {
  const { tabName, categoryName } = useFeedContext();

  const { aids, aidsCount, loading, setAidsData, searchAids } = useAidList({
    location: tabName,
    tabName,
    categoryName,
  });

  const handleSearch = (query) => {
    searchAids(query);
  };

  return loading ? (
    <div className="aid-preview">
      <em>Loading aid form list...</em>
    </div>
  ) : (
    <>
      <SearchBar onSearch={handleSearch} />
      {aids.length > 0 ? (
        <>
          <AidsPreview
            aids={aids}
            loading={loading}
            updateAids={setAidsData}
          />

          <AidsPagination
            aidsCount={aidsCount}
            location={tabName}
            categoryName={categoryName}
            updateAids={setAidsData}
          />
        </>
      ) : (
        <div className="aid-preview">Aid forms not available.</div>
      )}
    </>
  );
}

export default HomeAids;
