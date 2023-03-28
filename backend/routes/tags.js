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
        icon: "pi pi-home",
        children: [
          {
            key: "shelter_giver",
            label: "Give Shelter",
          },
          {
            key: "shelter_taker",
            label: "Take Shelter",
          },
        ],
      },
      {
        key: "medicine",
        label: "Medicine",
        icon: "pi pi-heart",
        children: [
          {
            key: "medicine_giver",
            label: "Give Medicine",
          },
          {
            key: "medicine_taker",
            label: "Take Medicine",
          },
        ],
      },
      {
        key: "food",
        label: "Food",
        icon: "pi pi-shopping-cart",
        children: [
          {
            key: "food_giver",
            label: "Give Food",
          },
          {
            key: "food_taker",
            label: "Take Food",
          },
        ],
      },
      {
        key: "clothes",
        label: "Clothes",
        icon: "pi pi-cart-plus",
        children: [
          {
            key: "clothes_giver",
            label: "Give Clothes",
          },
          {
            key: "clothes_taker",
            label: "Take Clothes",
          },
        ],
      },
    ];

    res.json(tags);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
