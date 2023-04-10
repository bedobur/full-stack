const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");
const { appendFollowers } = require("../helper/helpers");
const { Aid, Comment, User } = require("../models");

//? All Comments for Aid
const allComments = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    const { slug } = req.params;

    const aid = await Aid.findOne({ where: { slug: slug } });
    if (!aid) throw new NotFoundError("Aid");

    const comments = await aid.getComments({
      include: [
        { model: User, as: "author", attributes: { exclude: ["email"] } },
      ],
    });

    for (const comment of comments) {
      await appendFollowers(loggedUser, comment);
    }

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

//* Create Comment for Aid
const createComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { body } = req.body.comment;
    if (!body) throw new FieldRequiredError("Comment body");

    const { slug } = req.params;
    const aid = await Aid.findOne({ where: { slug: slug } });
    if (!aid) throw new NotFoundError("Aid");

    const comment = await Comment.create({
      body: body,
      aidId: aid.id,
      userId: loggedUser.id,
    });

    delete loggedUser.dataValues.token;
    comment.dataValues.author = loggedUser;
    await appendFollowers(loggedUser, loggedUser);

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

//* Delete Comment for Aid
const deleteComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    if (loggedUser.id !== comment.userId) {
      throw new ForbiddenError("comment");
    }

    await comment.destroy();

    res.json({ message: { body: ["Comment deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { allComments, createComment, deleteComment };
