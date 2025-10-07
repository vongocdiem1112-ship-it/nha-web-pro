#!/usr/bin/env node

// Simple Node.js script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔄 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Present ✅' : 'Missing ❌');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      
      // Check if tables exist
      if (error.message.includes('relation "users" does not exist')) {
        console.log('💡 It looks like the database schema hasn\'t been created yet.');
        console.log('   Please run the SQL files in the supabase/ directory in your Supabase dashboard.');
      }
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Database is ready to use');
    return true;
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    return false;
  }
}

// Run the test
testConnection().then((success) => {
  process.exit(success ? 0 : 1);
});