const express = require("express");
const router = express.Router();
const { Subcategory } = require("../models");
const { appendSubcategoryList } = require("../helper/helpers");

// All Subcategories
router.get("/", async (req, res, next) => {
  try {
    const subcategoryList = await Subcategory.findAll();

    const subcategories = appendSubcategoryList(subcategoryList);

    res.json({ subcategories });
  } catch (error) {
    next(error);
  }
});

// Subcategories by Category
router.get("/select", async (req, res, next) => {
  try {
    const subcategories = {
      "shelter": [
        {
          key: "tent",
          label: "Tent",
        },
        {
          key: "room",
          label: "Room",
        },
        {
          key: "apartment",
          label: "Apartment",
        },
        {
          key: "others",
          label: "Others",
        },
      ],
      "medicine": [
        {
          key: "painkillers",
          label: "Painkillers",
        },{
          key: "antibiotics",
          label: "Antibiotics",
        },
        {
          key: "antiseptics",
          label: "Antiseptics",
        },
        {
          key: "others",
          label: "Others",
        }
      ],
      "food": [
        {
          key: "water",
          label: "Water",
        },
        {
          key: "canned-food",
          label: "Canned Food",
        },
        {
          key: "dry-food",
          label: "Dry Food",
        },
        {
          key: "baby-food",
          label: "Baby Food",
        },
        {
          key: "others",
          label: "Others",
        }
      ],
      "clothes": [
        {
          key: "jacket",
          label: "Jacket",
        },
        {
          key: "t-shirt",
          label: "T-Shirt",
        },
        {
          key: "pants",
          label: "Pants",
        },
        {
          key: "shoes",
          label: "Shoes",
        },
        {
          key: "underwear",
          label: "Underwear",
        },
        {
          key: "others",
          label: "Others",
        },
      ],
      "household-appliances": [
        {
          key: "refrigerator",
          label: "Refrigerator",
        },
        {
          key: "dishwasher",
          label: "Dishwasher",
        },
        {
          key: "stove",
          label: "Stove",
        },
        {
          key: "washing-machine",
          label: "Washing Machine",
        },
        {
          key: "others",
          label: "Others",
        },
      ],
      furniture: [
        {
          key: "bed",
          label: "Bed",
        },
        {
          key: "table",
          label: "Table",
        },
        {
          key: "chair",
          label: "Chair",
        },
        {
          key: "sofa",
          label: "Sofa",
        },
        {
          key: "others",
          label: "Others",
        },
      ],
      others: [
        {
          key: "etc",
          label: "Etc.",
        },
      ],
    };

    res.json(subcategories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
