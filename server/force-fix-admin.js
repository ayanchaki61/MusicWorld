require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Amiayan@61', salt);

    console.log('Hashed password:', hashedPassword);
    console.log('Hash length:', hashedPassword.length);
    console.log('');

    // Update admin user directly with hashed password
    const result = await mongoose.connection.collection('users').updateOne(
      { email: 'admin@musicworld.com' },
      { 
        $set: { 
          password: hashedPassword,
          role: 'admin'
        } 
      }
    );

    console.log('✅ Update result:', result.modifiedCount, 'document(s) modified');
    
    // Verify the update
    const user = await mongoose.connection.collection('users').findOne({ email: 'admin@musicworld.com' });
    
    console.log('\n✅ Verification:');
    console.log('   Email:', user.email);
    console.log('   Username:', user.username);
    console.log('   Role:', user.role);
    console.log('   Password exists:', !!user.password);
    console.log('   Password length:', user.password ? user.password.length : 0);
    console.log('   Password starts with $2:', user.password ? user.password.startsWith('$2') : false);
    
    console.log('\n📧 Login with:');
    console.log('   Email: admin@musicworld.com');
    console.log('   Password: Amiayan@61');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAdmin();
