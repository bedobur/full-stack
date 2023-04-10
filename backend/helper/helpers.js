const slugify = (string) => {
  return string.trim().toLowerCase().replace(/\W|_/g, "-");
};

const appendCategoryList = (aidCategories, aid) => {
  const categoryList = aidCategories.map((category) => category.name);

  if (!aid) return categoryList;
  aid.dataValues.categoryList = categoryList;
};

const appendFavorites = async (loggedUser, aid) => {
  const favorited = await aid.hasUser(loggedUser ? loggedUser : null);
  aid.dataValues.favorited = loggedUser ? favorited : false;

  const favoritesCount = await aid.countUsers();
  aid.dataValues.favoritesCount = favoritesCount;
};

const appendFollowers = async (loggedUser, toAppend) => {
  //
  if (toAppend?.author) {
    const author = await toAppend.getAuthor();

    const following = await author.hasFollower(loggedUser ? loggedUser : null);
    toAppend.author.dataValues.following = loggedUser ? following : false;

    const followersCount = await author.countFollowers();
    toAppend.author.dataValues.followersCount = followersCount;
    //
  } else {
    const following = await toAppend.hasFollower(
      loggedUser ? loggedUser : null,
    );
    toAppend.dataValues.following = loggedUser ? following : false;

    const followersCount = await toAppend.countFollowers();
    toAppend.dataValues.followersCount = followersCount;
  }
};

module.exports = { slugify, appendCategoryList, appendFavorites, appendFollowers };
