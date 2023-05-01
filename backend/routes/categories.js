const express = require("express");
const router = express.Router();
const { Category } = require("../models");
const { appendCategoryList } = require("../helper/helpers");

// All Categories
router.get("/", async (req, res, next) => {
  try {
    const categoryList = await Category.findAll();

    const categories = appendCategoryList(categoryList);

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.get("/select", async (req, res, next) => {
  try {
    const categories = [
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
      {
        key: "other",
        label: "Other",
        icon: "pi pi-ellipsis-h",
        children: [
          {
            key: "other_giver",
            label: "Give",
          },
          {
            key: "other_take",
            label: "Take",
          },
        ],
      },
    ];

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
