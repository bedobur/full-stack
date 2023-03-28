const express = require("express");
const router = express.Router();
const { Tag } = require("../models");
const { appendTagList } = require("../helper/helpers");

// All Tags
router.get("/", async (req, res, next) => {
  try {
    const tagList = await Tag.findAll();

    const tags = appendTagList(tagList);

    res.json({ tags });
  } catch (error) {
    next(error);
  }
});

router.get("/select", async (req, res, next) => {
  try {
    const tags = [
      {
        key: "shelter",
        label: "Shelter",
        icon: 'pi pi-home'
      },
      {
        key: "medicine",
        label: "Medicine",
        icon: 'pi pi-heart'
      },
      {
        key: "food",
        label: "Food",
        icon: 'pi pi-shopping-cart'
      },
      {
        key: "clothes",
        label: "Clothes",
        icon: 'pi pi-cart-plus',
        children: []
      }
    ];

    res.json(tags);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
