import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getCategoriesSelect() {
  try {
    const data = await axios({ url: "/api/categories/select" });

    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default getCategoriesSelect;
