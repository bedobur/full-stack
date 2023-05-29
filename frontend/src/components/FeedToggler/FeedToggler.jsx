import { useAuth } from "../../context/AuthContext";
import { useFeedContext } from "../../context/FeedContext";
import FeedNavLink from "./FeedNavLink";

function FeedToggler() {
  const { isAuth } = useAuth();
  const { tabName, categoryName } = useFeedContext();

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {/*<FeedNavLink name="global" text="Global Feed" />*/}
        <FeedNavLink name="provider" text="Aid Providers" />
        <FeedNavLink name="requester" text="Aid Requesters" />
        {isAuth && <FeedNavLink name="feed" text="Following Feed" />}
        {isAuth && <FeedNavLink name="matched" text="Matched Aids" />}
        {tabName === "category" && <FeedNavLink icon name="category" text={categoryName} />}
      </ul>
    </div>
  );
}

export default FeedToggler;
