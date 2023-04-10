"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Aid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Category, Comment }) {
      // define association here

      // Users
      this.belongsTo(User, { foreignKey: "userId", as: "author" });

      // Comments
      this.hasMany(Comment, { foreignKey: "aidId", onDelete: "cascade" });

      // Category list
      this.belongsToMany(Category, {
        through: "CategoryList",
        as: "categoryList",
        foreignKey: "aidId",
        timestamps: false,
        onDelete: "cascade", // FIXME: delete categories
      });

      // Favorites
      this.belongsToMany(User, {
        through: "Favorites",
        foreignKey: "aidId",
        timestamps: false,
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
      };
    }
  }
  Aid.init(
    {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Aid",
    },
  );
  return Aid;
};
