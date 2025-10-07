#!/usr/bin/env node

// Create database schema using Supabase SQL execution
const https = require('https');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🚀 Creating database schema directly...');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing credentials');
  process.exit(1);
}

// Extract project reference from URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

// SQL to create basic schema
const createSchemaSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'broker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM ('nha', 'dat', 'chung_cu', 'cho_thue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('active', 'hidden', 'sold', 'rented');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type listing_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  area NUMERIC NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
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
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_district ON listings(district);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- Insert sample data
INSERT INTO users (email, full_name, phone, role) 
VALUES ('demo@vungtauland.com', 'Demo Broker', '0901234567', 'broker')
ON CONFLICT (email) DO NOTHING;

-- Get the demo user ID and insert sample listing
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@vungtauland.com';
    
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO listings (
            user_id, type, title, description, price, area, bedrooms, bathrooms,
            address, district, latitude, longitude, images, is_hot, status
        ) VALUES (
            demo_user_id, 'nha', 'Nhà phố 2 tầng gần biển Vũng Tàu',
            'Nhà phố đẹp, gần biển, tiện ích đầy đủ', 2500000000, 80, 3, 2,
            '123 Đường Hạ Long', 'Vũng Tàu', 10.3460, 107.0843,
            ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
            true, 'active'
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;
`;

// Function to execute SQL via HTTP POST to Supabase
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function createSchema() {
  try {
    console.log('📝 Executing schema creation SQL...');
    
    const result = await executeSQL(createSchemaSQL);
    console.log('✅ Schema creation completed!');
    
    // Test the created tables
    console.log('\n🔍 Testing created tables...');
    
    // Use the previous test script
    const { spawn } = require('child_process');
    const testProcess = spawn('node', ['test-tables.js'], { stdio: 'inherit' });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n🎉 Database setup completed successfully!');
        console.log('🚀 Run: npm run start-web');
      } else {
        console.log('\n⚠️  Some issues detected, but basic setup is done');
      }
    });
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message);
    
    // Fallback: Show manual instructions
    console.log('\n💡 Manual setup required:');
    console.log('1. Go to: https://app.supabase.com/project/zewyoonmkknfbgrmsfhw');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Create a new query and paste the contents of: supabase/schema.sql');
    console.log('4. Run the query');
  }
}

createSchema();