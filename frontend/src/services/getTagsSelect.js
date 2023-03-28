import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getTagsSelect() {
  try {
    const data = await axios({ url: "/api/tags/select" });

    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default getTagsSelect;
