const mongoose = require('mongoose');
require('dotenv').config();

const Cart = require('./models/Cart');

const clearAllCarts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pc_parts_store');
    console.log('Connected to MongoDB');

    const result = await Cart.deleteMany({});
    console.log(`Deleted ${result.deletedCount} carts`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing carts:', error);
    process.exit(1);
  }
};

clearAllCarts();
