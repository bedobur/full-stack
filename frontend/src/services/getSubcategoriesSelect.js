import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getSubcategoriesSelect() {
  try {
    const data = await axios({ url: "/api/subcategories/select" });

    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default getSubcategoriesSelect;
