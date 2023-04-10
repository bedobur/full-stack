import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getCategories() {
  try {
    const { data } = await axios({ url: "/api/categories" });

    return data.categories;
  } catch (error) {
    errorHandler(error);
  }
}

export default getCategories;
