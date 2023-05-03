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

// Categories by Category
router.get("/select", async (req, res, next) => {
  try {
    const categories = [
      {
        key: "shelter",
        label: "Shelter"
      },
      {
        key: "medicine",
        label: "Medicine"
      },
      {
        key: "food",
        label: "Food"
      },
      {
        key: "clothes",
        label: "Clothes"
      },
      {
        key: "household-appliances",
        label: "Household Appliances"
      },
      {
        key: "furniture",
        label: "Furniture"
      },
      {
        key: "others",
        label: "Others"
      }
    ];

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
