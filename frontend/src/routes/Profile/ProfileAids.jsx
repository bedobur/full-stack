import { useParams } from "react-router-dom";
import AidsPagination from "../../components/AidsPagination";
import AidsPreview from "../../components/AidsPreview";
import useAidList from "../../hooks/useAids";

function ProfileAids() {
  const { username } = useParams();

  const { aids, aidsCount, loading, setAidsData } = useAidList({
    location: "profile",
    username,
  });

  return loading ? (
    <div className="aid-preview">
      <em>Loading {username} aids...</em>
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
        location="profile"
        updateAids={setAidsData}
        username={username}
      />
    </>
  ) : (
    <div className="aid-preview">{username} doesn't have aids.</div>
  );
}

export default ProfileAids;
