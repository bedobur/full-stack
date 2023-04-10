import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function getAid({ headers, slug }) {
  try {
    const { data } = await axios({ headers, url: `api/aids/${slug}` });

    return data.aid;
  } catch (error) {
    errorHandler(error);
  }
}

export default getAid;
