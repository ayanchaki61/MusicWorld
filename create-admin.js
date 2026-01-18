// Script to create admin user and update role
const axios = require('axios');
const mongoose = require('mongoose');

const API_URL = 'http://localhost:5000/api';
const MONGO_URI = 'mongodb://localhost:27017/musicworld';

async function createAdminUser() {
  try {
    // Register user
    console.log('Registering admin user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      username: 'admin',
      email: 'admin@musicworld.com',
      password: 'Amiayan@61'
    });
    
    console.log('✅ User registered successfully');
    console.log('User ID:', registerResponse.data.data._id);
    
    // Connect to MongoDB and update role
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Update user role to admin
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String
    }));
    
    const result = await User.updateOne(
      { email: 'admin@musicworld.com' },
      { $set: { role: 'admin' } }
    );
    
    console.log('✅ User role updated to admin');
    console.log('\n🎉 Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('  Email: admin@musicworld.com');
    console.log('  Password: Amiayan@61');
    console.log('\nYou can now login at: http://localhost:5173/login');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    if (error.response?.data) {
      console.error('❌ Error:', error.response.data.message);
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

createAdminUser();
