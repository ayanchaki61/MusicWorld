// Update user role to admin
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/musicworld';

async function updateRole() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
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
    
    if (result.modifiedCount > 0) {
      console.log('✅ Role updated to admin successfully!');
      console.log('\nPlease logout and login again at: http://localhost:5173/login');
    } else {
      console.log('ℹ️ Role was already set to admin (no changes needed)');
    }
    
    // Verify the update
    const user = await User.findOne({ email: 'admin@musicworld.com' });
    console.log('\nCurrent user details:');
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateRole();
