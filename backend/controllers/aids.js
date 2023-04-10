const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const {
  AlreadyTakenError,
  FieldRequiredError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} = require("../helper/customErrors");
const {
  appendFollowers,
  appendFavorites,
  appendCategoryList,
  slugify,
} = require("../helper/helpers");
const { Aid, Category, User } = require("../models");

const includeOptions = [
  { model: Category, as: "categoryList", attributes: ["name"] },
  { model: User, as: "author", attributes: { exclude: ["email"] } },
];

//? All Aids - by Author/by Category/Favorited by user
const allAids = async (req, res, next) => {
  try {
    const { loggedUser } = req;

    const { author, category, filter, favorited, limit = 3, offset = 0 } = req.query;
    const searchOptions = {
      include: [
        {
          model: Category,
          as: "categoryList",
          attributes: ["name"],
          ...(category && { where: { name: category } }),
        },
        {
          model: User,
          as: "author",
          attributes: { exclude: ["email"] },
          ...(author && { where: { username: author } }),
        },
      ],
      limit: parseInt(limit),
      offset: offset * limit,
      order: [["createdAt", "DESC"]],
    };

    let aids = { rows: [], count: 0 };
    if (favorited) {
      const user = await User.findOne({ where: { username: favorited } });

      aids.rows = await user.getFavorites(searchOptions);
      aids.count = await user.countFavorites();
    } else {
      aids = await Aid.findAndCountAll(searchOptions);
    }

    for (let aid of aids.rows) {
      const aidCategories = await aid.getCategoryList();

      appendCategoryList(aidCategories, aid);
      await appendFollowers(loggedUser, aid);
      await appendFavorites(loggedUser, aid);

      delete aid.dataValues.Favorites;
    }

    res.json({ aids: aids.rows, aidsCount: aids.count });
  } catch (error) {
    next(error);
  }
};

//* Create Aid
const createAid = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { title, description, body, categoryList } = req.body.aid;
    if (!title) throw new FieldRequiredError("A title");
    if (!description) throw new FieldRequiredError("A description");
    if (!body) throw new FieldRequiredError("An aid body");

    const slug = slugify(title);
    //const slugInDB = await Aid.findOne({ where: { slug: slug } });
    //if (slugInDB) throw new AlreadyTakenError("Title");

    const aid = await Aid.create({
      slug: slug,
      title: title,
      description: description,
      body: body,
    });

    for (const category of categoryList) {
      const categoryInDB = await Category.findByPk(category.trim());

      if (categoryInDB) {
        await aid.addCategoryList(categoryInDB);
      } else if (category.length > 2) {
        const newCategory = await Category.create({ name: category.trim() });

        await aid.addCategoryList(newCategory);
      }
    }

    delete loggedUser.dataValues.token;

    aid.dataValues.categoryList = categoryList;
    aid.setAuthor(loggedUser);
    aid.dataValues.author = loggedUser;
    await appendFollowers(loggedUser, loggedUser);
    await appendFavorites(loggedUser, aid);

    res.status(201).json({ aid });
  } catch (error) {
    next(error);
  }
};

//* Feed
const aidsFeed = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { limit = 3, offset = 0 } = req.query;
    const authors = await loggedUser.getFollowing();

    const aids = await Aid.findAndCountAll({
      include: includeOptions,
      limit: parseInt(limit),
      offset: offset * limit,
      order: [["createdAt", "DESC"]],
      where: { userId: authors.map((author) => author.id) },
    });

    for (const aid of aids.rows) {
      const aidCategories = await aid.getCategoryList();

      appendCategoryList(aidCategories, aid);
      await appendFollowers(loggedUser, aid);
      await appendFavorites(loggedUser, aid);
    }

    res.json({ aids: aids.rows, aidsCount: aids.count });
  } catch (error) {
    next(error);
  }
};

// Single Aid by slug
const singleAid = async (req, res, next) => {
  try {
    const { loggedUser } = req;

    const { slug } = req.params;
    const aid = await Aid.findOne({
      where: { slug: slug },
      include: includeOptions,
    });
    if (!aid) throw new NotFoundError("Aid");

    appendCategoryList(aid.categoryList, aid);
    await appendFollowers(loggedUser, aid);
    await appendFavorites(loggedUser, aid);

    res.json({ aid });
  } catch (error) {
    next(error);
  }
};

//* Update Aid
const updateAid = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;
    const aid = await Aid.findOne({
      where: { slug: slug },
      include: includeOptions,
    });
    if (!aid) throw new NotFoundError("Aid");

    if (loggedUser.id !== aid.author.id) {
      throw new ForbiddenError("aid");
    }

    const { title, description, body } = req.body.aid;
    if (title) {
      aid.slug = slugify(title);
      aid.title = title;
    }
    if (description) aid.description = description;
    if (body) aid.body = body;
    await aid.save();

    appendCategoryList(aid.categoryList, aid);
    await appendFollowers(loggedUser, aid);
    await appendFavorites(loggedUser, aid);

    res.json({ aid });
  } catch (error) {
    next(error);
  }
};

//* Delete Aid
const deleteAid = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;
    const aid = await Aid.findOne({
      where: { slug: slug },
      include: includeOptions,
    });
    if (!aid) throw new NotFoundError("Aid");

    if (loggedUser.id !== aid.author.id) {
      throw new ForbiddenError("aid");
    }

    await aid.destroy();

    res.json({ message: { body: ["Aid deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allAids,
  createAid,
  singleAid,
  updateAid,
  deleteAid,
  aidsFeed,
};
