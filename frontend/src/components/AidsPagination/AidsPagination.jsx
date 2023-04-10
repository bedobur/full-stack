import ReactPaginate from "react-paginate";
import { useAuth } from "../../context/AuthContext";
import getAids from "../../services/getAids";

function AidsPagination({
  aidsCount,
  location,
  categoryName,
  updateAids,
  username,
}) {
  const totalPages = Math.ceil(aidsCount / 3);
  const { headers } = useAuth();

  const handlePageChange = ({ selected: page }) => {
    getAids({ headers, location, page, username, categoryName })
      .then(updateAids)
      .catch(console.error);
  };

  return (
    <ReactPaginate
      activeClassName="active"
      breakClassName="page-item"
      breakLabel="..."
      breakLinkClassName="page-link"
      containerClassName="pagination pagination-sm"
      nextClassName="page-item"
      nextLabel={<i className="ion-arrow-right-b"></i>}
      nextLinkClassName="page-link"
      onPageChange={handlePageChange}
      pageClassName="page-item"
      pageCount={totalPages}
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLabel={<i className="ion-arrow-left-b"></i>}
      previousLinkClassName="page-link"
      renderOnZeroPageCount={null}
    />
  );
}

export default AidsPagination;
