#!/usr/bin/env node

// Setup database using Supabase REST API
const https = require('https');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🚀 Setting up database using REST API...');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing credentials');
  process.exit(1);
}

// Sample data to insert
const sampleUser = {
  email: 'demo@vungtauland.com',
  full_name: 'Demo User',
  phone: '0901234567',
  role: 'broker'
};

const sampleListing = {
  title: 'Nhà phố 2 tầng gần biển Vũng Tàu',
  description: 'Nhà phố đẹp, gần biển, tiện ích đầy đủ',
  type: 'nha',
  price: 2500000000,
  area: 80,
  bedrooms: 3,
  bathrooms: 2,
  address: '123 Đường Hạ Long',
  district: 'Vũng Tàu',
  city: 'Bà Rịa - Vũng Tàu',
  latitude: 10.3460,
  longitude: 107.0843,
  images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
  is_hot: true,
  status: 'active'
};

async function makeRequest(method, table, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
    
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAndSetup() {
  try {
    console.log('🔍 Testing database tables...\n');
    
    // Test users table
    try {
      await makeRequest('GET', 'users?limit=1');
      console.log('✅ Users table exists and is accessible');
      
      // Try to insert sample user
      try {
        await makeRequest('POST', 'users', sampleUser);
        console.log('✅ Sample user created successfully');
      } catch (err) {
        if (err.message.includes('duplicate key')) {
          console.log('ℹ️  Sample user already exists');
        } else {
          console.log('⚠️  Could not create sample user:', err.message);
        }
      }
      
    } catch (err) {
      console.log('❌ Users table not accessible:', err.message);
      console.log('💡 Please run the SQL schema manually in Supabase dashboard');
      return false;
    }
    
    // Test listings table
    try {
      await makeRequest('GET', 'listings?limit=1');
      console.log('✅ Listings table exists and is accessible');
      
      // Get a user ID for the sample listing
      try {
        const userResponse = await makeRequest('GET', 'users?limit=1');
        const users = JSON.parse(userResponse.data);
        
        if (users.length > 0) {
          const userId = users[0].id;
          sampleListing.user_id = userId;
          
          try {
            await makeRequest('POST', 'listings', sampleListing);
            console.log('✅ Sample listing created successfully');
          } catch (err) {
            console.log('ℹ️  Sample listing might already exist');
          }
        }
      } catch (err) {
        console.log('⚠️  Could not create sample listing');
      }
      
    } catch (err) {
      console.log('❌ Listings table not accessible:', err.message);
    }
    
    // Test other tables
    const tables = ['favorites', 'conversations', 'messages'];
    for (const table of tables) {
      try {
        await makeRequest('GET', `${table}?limit=1`);
        console.log(`✅ ${table} table exists and is accessible`);
      } catch (err) {
        console.log(`❌ ${table} table not accessible`);
      }
    }
    
    console.log('\n🎉 Database connectivity test completed!');
    console.log('🚀 Your app is ready to use with Supabase');
    console.log('💡 Run: npm run start-web');
    
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    return false;
  }
}

testAndSetup();