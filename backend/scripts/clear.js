require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Notification = require('../models/Notification');

const clearData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for clearing...');

    await User.deleteMany();
    await Leave.deleteMany();
    await Notification.deleteMany();
    
    console.log('Database collections cleared successfully! (All data wiped)');
    process.exit(0);
  } catch (error) {
    console.error('Clearing database failed:', error);
    process.exit(1);
  }
};

clearData();
