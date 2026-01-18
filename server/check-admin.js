require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Check for admin user
    const admin = await User.findOne({ email: 'admin@musicworld.com' });
    
    if (admin) {
      console.log('\n✅ Admin user found!');
      console.log('Email:', admin.email);
      console.log('Username:', admin.username);
      console.log('Role:', admin.role);
      console.log('Password hash exists:', !!admin.password);
    } else {
      console.log('\n❌ No admin user found in database');
      console.log('Need to create admin user');
    }

    // Show all users
    const allUsers = await User.find({});
    console.log(`\nTotal users in database: ${allUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAdmin();
