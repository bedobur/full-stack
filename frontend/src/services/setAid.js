import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function setAid({ body, description, headers, slug, categoryList, title }) {
  try {
    const { data } = await axios({
      data: { aid: { title, description, body, categoryList } },
      headers,
      method: slug ? "PUT" : "POST",
      url: slug ? `api/aids/${slug}` : "api/aids",
    });

    return data.aid.slug;
  } catch (error) {
    errorHandler(error);
  }
}

export default setAid;
