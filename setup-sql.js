#!/usr/bin/env node

// Direct SQL execution for Supabase setup
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🚀 Setting up Supabase database with direct SQL execution...');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Direct SQL statements to create the schema
const sqlStatements = [
  // Enable UUID extension
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  
  // Create ENUMs
  `DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'broker', 'admin');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`,
  
  `DO $$ BEGIN
    CREATE TYPE broker_status AS ENUM ('pending', 'approved', 'rejected');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`,
  
  `DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM ('nha', 'dat', 'chung_cu', 'cho_thue');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`,
  
  `DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('active', 'hidden', 'sold', 'rented');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`,
  
  // Create users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    broker_status broker_status,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  // Create listings table
  `CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type listing_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    area NUMERIC NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    direction TEXT,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    city TEXT DEFAULT 'Bà Rịa - Vũng Tàu' NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_hot BOOLEAN DEFAULT FALSE,
    status listing_status DEFAULT 'active' NOT NULL,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  // Create favorites table
  `CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
  );`,
  
  // Create conversations table
  `CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(listing_id, user_id, broker_id)
  );`,
  
  // Create messages table
  `CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  // Create indexes
  `CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);`,
  `CREATE INDEX IF NOT EXISTS idx_listings_district ON listings(district);`,
  `CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);`,
  `CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id, created_at DESC);`
];

async function executeSQLStatements() {
  console.log('📝 Executing SQL statements...\n');
  
  let successCount = 0;
  let totalCount = sqlStatements.length;
  
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    const statementName = sql.substring(0, 50).replace(/\n/g, ' ').trim() + '...';
    
    try {
      process.stdout.write(`[${i + 1}/${totalCount}] ${statementName}`);
      
      const { error } = await supabase.rpc('exec', { sql: sql });
      
      if (error) {
        console.log(' ❌');
        console.log(`    Error: ${error.message}`);
      } else {
        console.log(' ✅');
        successCount++;
      }
    } catch (err) {
      console.log(' ❌');
      console.log(`    Error: ${err.message}`);
    }
  }
  
  console.log(`\n🎉 Executed ${successCount}/${totalCount} statements successfully`);
  return successCount;
}

async function testSetup() {
  console.log('\n🔍 Testing database setup...');
  
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Could not access users table:', error.message);
      return false;
    }
    
    console.log('✅ Users table is accessible');
    
    const { data: listingsData, error: listingsError } = await supabase
      .from('listings')
      .select('count', { count: 'exact', head: true });
    
    if (!listingsError) {
      console.log('✅ Listings table is accessible');
    }
    
    console.log('\n🎯 Database setup completed successfully!');
    console.log('💡 You can now run: npm run start-web');
    
    return true;
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

async function main() {
  try {
    const successCount = await executeSQLStatements();
    
    if (successCount > 0) {
      await testSetup();
    } else {
      console.log('❌ No SQL statements were executed successfully');
      console.log('💡 You may need to run the SQL files manually in Supabase dashboard');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();