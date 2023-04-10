import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function deleteAid({ slug, headers }) {
  try {
    const { data } = await axios({
      headers,
      method: "DELETE",
      url: `api/aids/${slug}/`,
    });

    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default deleteAid;
