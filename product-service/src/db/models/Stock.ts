import { DataTypes } from 'sequelize';
import { sequelize } from '@db';
import { Product } from './Product';

export const Stock = sequelize.define(
  'stocks',
  {
    product_id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
);

Product.hasOne(Stock, { as: 'stocks', foreignKey: 'product_id' });
Stock.belongsTo(Product);
