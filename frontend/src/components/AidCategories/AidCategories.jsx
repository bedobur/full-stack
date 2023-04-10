function AidCategories({ categoryList }) {
  return (
    categoryList?.length > 0 && (
      <ul className="category-list">
        {categoryList.map((category) => (
          <li key={category} className="category-default category-pill category-outline">
            {category}
          </li>
        ))}
      </ul>
    )
  );
}

export default AidCategories;
