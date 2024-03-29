"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Aid }) {
      // define association here

      // Comments
      this.belongsTo(Aid, { foreignKey: "aidId" });
      this.belongsTo(User, { as: "author", foreignKey: "userId" });
    }

    toJSON() {
      return {
        ...this.get(),
        aidId: undefined,
        userId: undefined,
      };
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );
  return Comment;
};
