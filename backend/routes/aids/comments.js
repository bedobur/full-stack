const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authentication");
const {
  allComments,
  createComment,
  deleteComment,
} = require("../../controllers/comments");

//? All Comments for Aid
router.get("/:slug/comments", verifyToken, allComments);
//* Create Comment for Aid
router.post("/:slug/comments", verifyToken, createComment);
//* Delete Comment for Aid
router.delete("/:slug/comments/:commentId", verifyToken, deleteComment);

module.exports = router;
