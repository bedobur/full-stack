import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import deleteAid from "../../services/deleteAid";

function AidAuthorButtons({ body, description, slug, categoryList, title }) {
  const { headers, isAuth } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuth) return alert("You need to login first");

    const confirmation = window.confirm("Want to delete the aid?");
    if (!confirmation) return;

    deleteAid({ headers, slug })
      .then(() => navigate("/"))
      .catch(console.error);
  };

  return (
    <>
      <button
        className="btn btn-sm"
        style={{ color: "#d00" }}
        onClick={handleClick}
      >
        <i className="ion-trash-a"></i> Delete Aid
      </button>{" "}
      <button className="btn btn-sm" style={{ color: "#777" }}>
        <Link
          className="nav-link"
          state={{ body, description, categoryList, title }}
          to={`/editor/${slug}`}
        >
          <i className="ion-edit"></i> Edit Aid
        </Link>
      </button>{" "}
    </>
  );
}

export default AidAuthorButtons;
