const axios = require('axios');

async function testAtlasConnection() {
  console.log('\n🔍 Testing MongoDB Atlas Configuration...\n');

  try {
    // Test 1: Login with admin credentials
    console.log('1️⃣ Testing Admin Login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@musicworld.com',
      password: 'Amiayan@61'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful!');
      console.log(`   User: ${loginResponse.data.data.email}`);
      console.log(`   Role: ${loginResponse.data.data.role}`);
      console.log(`   Token: ${loginResponse.data.data.token.substring(0, 20)}...`);
    }

    const token = loginResponse.data.data.token;

    // Test 2: Get music list
    console.log('\n2️⃣ Testing Music API...');
    const musicResponse = await axios.get('http://localhost:5000/api/music');
    console.log(`✅ Music API working! Found ${musicResponse.data.data.length} tracks`);

    // Test 3: Get genres
    console.log('\n3️⃣ Testing Genres API...');
    const genresResponse = await axios.get('http://localhost:5000/api/music/genres');
    console.log(`✅ Genres API working! Found ${genresResponse.data.data.length} genres`);

    // Test 4: Get current user
    console.log('\n4️⃣ Testing Auth Token...');
    const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Token validation working! User: ${meResponse.data.data.email}`);

    console.log('\n✨ All MongoDB Atlas tests passed successfully! ✨\n');
    console.log('📊 Summary:');
    console.log('   ✅ MongoDB Atlas connection: WORKING');
    console.log('   ✅ Admin user authentication: WORKING');
    console.log('   ✅ Database queries: WORKING');
    console.log('   ✅ JWT token generation: WORKING');
    console.log('\n🎉 Your application is ready for deployment!\n');

  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    console.log('\n⚠️  Make sure the server is running on http://localhost:5000\n');
  }
}

testAtlasConnection();
