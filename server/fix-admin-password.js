require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const fixAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@musicworld.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Amiayan@61', salt);

      const newAdmin = await User.create({
        username: 'admin',
        email: 'admin@musicworld.com',
        password: hashedPassword,
        role: 'admin'
      });

      console.log('✅ New admin user created!');
    } else {
      console.log('Found admin user, updating password...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Amiayan@61', salt);

      // Update the admin user
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();

      console.log('✅ Admin password updated successfully!');
    }

    console.log('\n📧 Email: admin@musicworld.com');
    console.log('🔑 Password: Amiayan@61');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAdminPassword();
