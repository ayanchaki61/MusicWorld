// Script to verify admin user
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/musicworld';

async function verifyUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String,
      createdAt: Date
    }));
    
    const user = await User.findOne({ email: 'admin@musicworld.com' });
    
    if (user) {
      console.log('✅ User found:');
      console.log('  ID:', user._id);
      console.log('  Username:', user.username);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Password Hash:', user.password.substring(0, 20) + '...');
      console.log('  Created:', user.createdAt);
      
      if (user.role !== 'admin') {
        console.log('\n⚠️ User role is not admin! Updating...');
        await User.updateOne(
          { email: 'admin@musicworld.com' },
          { $set: { role: 'admin' } }
        );
        console.log('✅ Role updated to admin');
      }
    } else {
      console.log('❌ No user found with email admin@musicworld.com');
      console.log('\nAll users:');
      const allUsers = await User.find({});
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.role})`);
      });
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyUser();
