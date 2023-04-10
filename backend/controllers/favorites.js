const { UnauthorizedError, NotFoundError } = require("../helper/customErrors");
const {
  appendFollowers,
  appendFavorites,
  appendCategoryList,
} = require("../helper/helpers");
const { Aid, Category, User } = require("../models");

//*  Favorite/Unfavorite Aid
const favoriteToggler = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;

    const aid = await Aid.findOne({
      where: { slug: slug },
      include: [
        {
          model: Category,
          as: "categoryList",
          attributes: ["name"],
        },
        {
          model: User,
          as: "author",
          attributes: ["username", "bio", "image" /* "following" */],
        },
      ],
    });
    if (!aid) throw new NotFoundError("Aid");

    if (req.method === "POST") await aid.addUser(loggedUser);
    if (req.method === "DELETE") await aid.removeUser(loggedUser);

    appendCategoryList(aid.categoryList, aid);
    await appendFollowers(loggedUser, aid);
    await appendFavorites(loggedUser, aid);

    res.json({ aid });
  } catch (error) {
    next(error);
  }
};

module.exports = { favoriteToggler };
