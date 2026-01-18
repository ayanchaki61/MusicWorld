// Test login directly
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin@musicworld.com...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@musicworld.com',
      password: 'Amiayan@61'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.data.username);
    console.log('Role:', response.data.data.role);
    console.log('Token:', response.data.data.token.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
