import { sequelize } from "../sequelizer/sequelizer.js";
import { DataTypes } from "sequelize";

export const Order = sequelize.define("Order", {
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      min: 40.0,
      max: 45.1
    }
  },

  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      min: -79.8,
      max: -71.8
    }
  },

  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },

  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    readOnly: true,
    defaultValue: DataTypes.NOW,
  }

}, {
  tableName: "orders",
  timestamps: false
});