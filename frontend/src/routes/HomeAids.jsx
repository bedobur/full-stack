import AidsPagination from "../components/AidsPagination";
import AidsPreview from "../components/AidsPreview";
import { useFeedContext } from "../context/FeedContext";
import useAidList from "../hooks/useAids";
import SearchBar from "../components/SearchBar";


function HomeAids() {
  const { tabName, categoryName } = useFeedContext();

  const { aids, aidsCount, loading, setAidsData, searchAids } = useAidList({
    location: tabName,
    tabName,
    categoryName,
  });

  return loading ? (
    <div className="aid-preview">
      <em>Loading aid form list...</em>
    </div>
  ) : (
    <>
      <SearchBar onSearch={searchAids} />
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
