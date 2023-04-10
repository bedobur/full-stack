import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AidAuthorButtons from "../AidAuthorButtons";
import FavButton from "../FavButton";
import FollowButton from "../FollowButton";

function AidsButtons({ aid, setAid }) {
  const { author: { username } = {}, author } = aid || {};
  const { loggedUser } = useAuth();
  const { slug } = useParams();

  const followHandler = (author) => {
    setAid((prev) => ({ ...prev, author }));
  };

  const handleFav = ({ favorited, favoritesCount }) => {
    setAid((prev) => ({ ...prev, favorited, favoritesCount }));
  };

  return loggedUser.username === username ? (
    <AidAuthorButtons {...aid} slug={slug} />
  ) : (
    <>
      <FollowButton {...author} handler={followHandler} />
      <FavButton {...aid} handler={handleFav} text />
    </>
  );
}

export default AidsButtons;
