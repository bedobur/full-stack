import { Link } from "react-router-dom";
import AidMeta from "../AidMeta";
import AidCategories from "../AidCategories";
import FavButton from "../FavButton";

function AidsPreview({ aids, loading, updateAids }) {
  const handleFav = (aid) => {
    const items = [...aids];

    const updatedAids = items.map((item) =>
      item.slug === aid.slug ? { ...item, ...aid } : item,
    );

    updateAids((prev) => ({ ...prev, aids: updatedAids }));
  };

  return aids?.length > 0 ? (
    aids.map((aid) => {
      return (
        <div className="aid-preview" key={aid.slug}>
          <AidMeta author={aid.author} createdAt={aid.createdAt}>
            <FavButton
              favorited={aid.favorited}
              favoritesCount={aid.favoritesCount}
              handler={handleFav}
              right
              slug={aid.slug}
            />
          </AidMeta>
          <Link
            to={`/aid/${aid.slug}`}
            state={aid}
            className="preview-link"
          >
            <h1>{aid.title}</h1>
            <p>{aid.description}</p>
            <h5>{aid.type}</h5>
            <h5>{aid.subcategoryList.join(', ')}</h5>
            <h5>{aid.location}</h5>
            <AidCategories categoryList={aid.categoryList} />
          </Link>
        </div>
      );
    })
  ) : loading ? (
    <div className="aid-preview">Loading aid forms...</div>
  ) : (
    <div className="aid-preview">No aid form available.</div>
  );
}

export default AidsPreview;
