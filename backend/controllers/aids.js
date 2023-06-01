const { Op } = require("sequelize");
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
  appendSubcategoryList,
  slugify,
} = require("../helper/helpers");
const { Aid, Category, Subcategory, User } = require("../models");

const includeOptions = [
  { model: Category, as: "categoryList", attributes: ["name"] },
  { model: Subcategory, as: "subcategoryList", attributes: ["name"] },
  { model: User, as: "author", attributes: { exclude: ["email"] } },
];

function isSubList(list, sublist) {
  for (const item of sublist) {
    if (!list.includes(item)) {
      return false;
    }
  }
  return true;
}

//? All Aids - by Author/by Category/Favorited by user
const allAids = async (req, res, next) => {
  try {
    const { loggedUser } = req;

    const { author, category, filter, favorited, limit = 3, offset = 0 , matched} = req.query;
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
    if(filter) searchOptions.where = { type: filter };

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
      const aidSubcategories = await aid.getSubcategoryList();

      appendCategoryList(aidCategories, aid);
      appendSubcategoryList(aidSubcategories, aid);
      await appendFollowers(loggedUser, aid);
      await appendFavorites(loggedUser, aid);

      delete aid.dataValues.Favorites;
    }

    if(matched) {
      let userAids = JSON.parse(JSON.stringify(aids.rows)); // User's own aids

      searchOptions.include[1].where = { username: {[Op.not]: loggedUser?.username} };

      aids = { rows: [], count: 0 };
      if (favorited) {
        const user = await User.findOne({ where: { username: favorited } });

        aids.rows = await user.getFavorites(searchOptions);
        aids.count = await user.countFavorites();
      } else {
        aids = await Aid.findAndCountAll(searchOptions);
      }

      for (let aid of aids.rows) {
        const aidCategories = await aid.getCategoryList();
        const aidSubcategories = await aid.getSubcategoryList();

        appendCategoryList(aidCategories, aid);
        appendSubcategoryList(aidSubcategories, aid);
        await appendFollowers(loggedUser, aid);
        await appendFavorites(loggedUser, aid);

      delete aid.dataValues.Favorites;
    }

      let otherAids = JSON.parse(JSON.stringify(aids.rows)) // Aids from other users
      
      /*
      **  !!!!!!!!!!!!!!!!!!!!! MATCHING ALGORITHM STARTS HERE !!!!!!!!!!!!!!!!!!!!!
      */

      let matchedAids = new Set();

      for(let userAid of userAids) {
        for(let otherAid of otherAids){
          if(otherAid.type === userAid.type || otherAid.categoryList[0].name !== userAid.categoryList[0].name || otherAid.location !== userAid.location) continue;
          
          let list, subList;
          if(otherAid.type === 'Provide') {
            list = otherAid.subcategoryList;
            subList = userAid.subcategoryList;
          } else {
            list = userAid.subcategoryList;
            subList = otherAid.subcategoryList;
          }

          if(isSubList(list, subList)){
            matchedAids.add(otherAid);
          }
        }
      }

      matchedAids = [...matchedAids]

      /*
      **  !!!!!!!!!!!!!!!!!!!!! MATCHING ALGORITHM ENDS HERE !!!!!!!!!!!!!!!!!!!!!
      */

      res.json({ aids: matchedAids, aidsCount: matchedAids.length });
    }
    else res.json({ aids: aids.rows, aidsCount: aids.count });
  } catch (error) {
    next(error);
  }
};

//* Create Aid
const createAid = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { type, title, description, body, categoryList , subcategoryList, location} = req.body.aid;
    if(!type) throw new FieldRequiredError("A type");
    if (!title) throw new FieldRequiredError("A title");
    if (!description) throw new FieldRequiredError("A description");
    if (!body) throw new FieldRequiredError("An aid body");
    if (!location) throw new FieldRequiredError("A location");

    const slug = slugify(title);
    const slugInDB = await Aid.findOne({ where: { slug: slug } });
    if (slugInDB) throw new AlreadyTakenError("Title");

    const aid = await Aid.create({
      slug: slug,
      type: type,
      title: title,
      description: description,
      body: body,
      location: location,
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

    for (const subcategory of subcategoryList) {
      const subcategoryInDB = await Subcategory.findByPk(subcategory.trim());

      if (subcategoryInDB) {
        await aid.addSubcategoryList(subcategoryInDB);
      } else if (subcategory.length > 2) {
        const newSubcategory = await Subcategory.create({ name: subcategory.trim() });

        await aid.addSubcategoryList(newSubcategory);
      }
    }

    delete loggedUser.dataValues.token;

    aid.dataValues.categoryList = categoryList;
    aid.dataValues.subcategoryList = subcategoryList;
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
      const aidSubcategories = await aid.getSubcategoryList();

      appendCategoryList(aidCategories, aid);
      appendSubcategoryList(aidSubcategories, aid);
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
    appendSubcategoryList(aid.subcategoryList, aid);
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

    const { type, title, description, body, location} = req.body.aid;
    if(type) aid.type = type;
    if (title) {
      aid.slug = slugify(title);
      aid.title = title;
    }
    if (description) aid.description = description;
    if (body) aid.body = body;
    if (location) aid.location = location;

    await aid.save();

    appendCategoryList(aid.categoryList, aid);
    appendCategoryList(aid.subcategoryList, aid);
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
