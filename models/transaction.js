"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Trip, {
        as: "trip",
        foreignKey: {
          name: "tripId",
        },
      });
      Transaction.belongsTo(models.User, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      counterQty: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      status: DataTypes.STRING,
      attachment: DataTypes.STRING,
      tripId: DataTypes.INTEGER,
      bookingDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
