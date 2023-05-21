import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function setAid({ body, description, headers, slug, categoryList, subcategoryList, title , type, location}) {
  try {
    const { data } = await axios({
      data: { aid: { type, title, description, body, categoryList, subcategoryList, location} },
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
