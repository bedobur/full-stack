import { useFeedContext } from "../../context/FeedContext";

function CategoryButton({ categoriesList }) {
  const { changeTab } = useFeedContext();

  const handleClick = (e) => {
    changeTab(e, "category");
  };

  return categoriesList.slice(0, 50).map((name) => (
    <button className="category-pill category-default" key={name} onClick={handleClick}>
      {name}
    </button>
  ));
}

export default CategoryButton;
