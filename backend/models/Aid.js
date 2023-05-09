"use strict";
const { Model } = require("sequelize");
const { search } = require("@orama/orama");

module.exports = (sequelize, DataTypes) => {
  class Aid extends Model {
    static associate({ User, Category, Subcategory, Comment }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId", as: "author" });
      this.hasMany(Comment, { foreignKey: "aidId", onDelete: "cascade" });
      this.belongsToMany(Category, {
        through: "CategoryList",
        as: "categoryList",
        foreignKey: "aidId",
        timestamps: false,
        onDelete: "cascade",
      });
      this.belongsToMany(Subcategory, {
        through: "SubcategoryList",
        as: "subcategoryList",
        foreignKey: "aidId",
        timestamps: false,
        onDelete: "cascade",
      });
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

    static async search(query) {
      const result = await search({
        index: "Aid",
        q: query,
        properties: "*",
      });
      return result;
    }
  }
  Aid.init(
    {
      slug: DataTypes.STRING,
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Aid",
    }
  );
  return Aid;
};
