require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@musicworld.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Amiayan@61', salt);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@musicworld.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully in Atlas!');
    console.log('Email: admin@musicworld.com');
    console.log('Password: Amiayan@61');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
