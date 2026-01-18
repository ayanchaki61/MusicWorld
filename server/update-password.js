// Script to update admin user password
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/musicworld';

async function updatePassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Hash the new password
    const newPassword = 'Amiayan@61';
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String
    }));
    
    const result = await User.updateOne(
      { email: 'admin@musicworld.com' },
      { $set: { password: hashedPassword } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Password updated successfully!');
      console.log('\n🎉 Admin credentials:');
      console.log('  Email: admin@musicworld.com');
      console.log('  Password: Amiayan@61');
      console.log('\nYou can now login at: http://localhost:5173/login');
    } else {
      console.log('⚠️ No user found with email admin@musicworld.com');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePassword();
