const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authentication");
const {
  allAids,
  createAid,
  singleAid,
  updateAid,
  deleteAid,
  aidsFeed,
} = require("../controllers/aids");

//? All Aids - by Author/by Category/Favorited by user
router.get("/", verifyToken, allAids);
//* Create Aid
router.post("/", verifyToken, createAid);
//* Feed
router.get("/feed", verifyToken, aidsFeed);
// Single Aid by slug
router.get("/:slug", verifyToken, singleAid);
//* Update Aid
router.put("/:slug", verifyToken, updateAid);
//* Delete Aid
router.delete("/:slug", verifyToken, deleteAid);

const favoritesRoutes = require("./aids/favorites");
const commentsRoutes = require("./aids/comments");

//> Favorites routes
router.use("/", favoritesRoutes);
//> Comments routes
router.use("/", commentsRoutes);

module.exports = router;
