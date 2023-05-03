"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Aid }) {
      // define association here

      // Category list
      this.belongsToMany(Aid, {
        through: "SubcategoryList",
        foreignKey: "subcategoryName",
        timestamps: false,
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        SubcategoryList: undefined,
      };
    }
  }
  Subcategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },

    },
    {
      sequelize,
      modelName: "Subcategory",
      timestamps: false,
    },
  );
  return Subcategory;
};
