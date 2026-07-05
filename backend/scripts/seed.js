require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Leave.deleteMany();
    await Notification.deleteMany();
    console.log('Existing collections cleared.');

    // Seed Super Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'Admin123',
      role: 'Super Admin',
      department: 'Management',
      designation: 'Director',
      phone: '1234567890',
      employeeCode: 'ADMIN001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      leaveBalances: { Casual: 12, Sick: 12, Paid: 12, Emergency: 12, WFH: 12 },
    });

    console.log('Super Admin seeded successfully.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
