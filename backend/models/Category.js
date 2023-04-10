"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Aid }) {
      // define association here

      // Category list
      this.belongsToMany(Aid, {
        through: "CategoryList",
        foreignKey: "categoryName",
        timestamps: false,
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        CategoryList: undefined,
      };
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },

    },
    {
      sequelize,
      modelName: "Category",
      timestamps: false,
    },
  );
  return Category;
};
