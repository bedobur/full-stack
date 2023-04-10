import { useEffect, useState } from "react";
import getCategories from "../../services/getCategories";
import CategoryButton from "./CategoryButton";

function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="col-md-3">
      <div className="sidebar">
        <h6>Popular Categories</h6>
        <div className="category-list">
          {categories.length > 0 ? (
            <CategoryButton categoriesList={categories} />
          ) : loading ? (
            <p>Loading categories...</p>
          ) : (
            <p>Category list not available</p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default PopularCategories;
