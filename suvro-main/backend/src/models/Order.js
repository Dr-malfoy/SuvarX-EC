const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { decimalGetter, jsonGetter } = require('../utils/modelGetters');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customer: {
    get: jsonGetter('customer', null),
    type: DataTypes.JSON, // Stores customer object
    allowNull: true,
  },
  items: {
    get: jsonGetter('items', []),
    type: DataTypes.JSON, // Stores array of order items
    allowNull: true,
  },
  total: {
    get: decimalGetter('total'),
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'New',
  },
  fulfillmentStatus: {
    type: DataTypes.ENUM('New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Failed Delivery'),
    defaultValue: 'New',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'Cash on Delivery',
  },
  paymentStatus: {
    type: DataTypes.ENUM('Unpaid', 'Collected'),
    defaultValue: 'Unpaid',
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subtotal: {
    get: decimalGetter('subtotal'),
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  discount: {
    get: decimalGetter('discount'),
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  deliveryCharge: {
    get: decimalGetter('deliveryCharge'),
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  courierName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dispatchDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

module.exports = Order;
