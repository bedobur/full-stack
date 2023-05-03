import axios from "axios";
import errorHandler from "../helpers/errorHandler";

// prettier-ignore
async function getAids({ headers, limit = 3, location, page = 0, categoryName, username }) {
  try {
    const url = {
      favorites: `api/aids?favorited=${username}&&limit=${limit}&&offset=${page}`,
      feed: `api/aids/feed?limit=${limit}&&offset=${page}`,
      global: `api/aids?limit=${limit}&&offset=${page}`,
      profile: `api/aids?author=${username}&&limit=${limit}&&offset=${page}`,
      provider: `api/aids?filter=Provide&&limit=${limit}&&offset=${page}`,
      requester: `api/aids?filter=Request&&limit=${limit}&&offset=${page}`,
      category: `api/aids?category=${categoryName}&&limit=${limit}&&offset=${page}`,
    };

    const { data } = await axios({ url: url[location], headers });

    return data;
  } catch (error) {
    errorHandler(error);
  }
}

export default getAids;
