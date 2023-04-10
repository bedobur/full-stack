import { useParams } from "react-router-dom";
import AidsPagination from "../../components/AidsPagination";
import AidsPreview from "../../components/AidsPreview";
import useAidList from "../../hooks/useAids";

function ProfileFavAids() {
  const { username } = useParams();

  const { aids, aidsCount, loading, setAidsData } = useAidList({
    location: "favorites",
    username,
  });

  return loading ? (
    <div className="aid-preview">
      <em>Loading {username} favorites aids...</em>
    </div>
  ) : aids.length > 0 ? (
    <>
      <AidsPreview
        aids={aids}
        loading={loading}
        updateAids={setAidsData}
      />

      <AidsPagination
        aidsCount={aidsCount}
        location="favorites"
        updateAids={setAidsData}
        username={username}
      />
    </>
  ) : (
    <div className="aid-preview">{username} doesn't have favorites.</div>
  );
}

export default ProfileFavAids;
