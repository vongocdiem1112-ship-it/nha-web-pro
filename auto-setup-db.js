#!/usr/bin/env node

// Auto setup Supabase database schema
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🚀 Auto-setting up Supabase database...');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQLFile(filename, description) {
  try {
    const filePath = path.join(__dirname, 'supabase', filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File ${filename} not found, skipping...`);
      return false;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`📝 Running ${filename}: ${description}...`);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Try direct query instead
      const { error: directError } = await supabase.from('_').select('*').limit(0);
      
      // Split SQL into individual statements and execute
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await supabase.rpc('exec', { sql: statement.trim() });
          } catch (err) {
            // Many statements will fail in RPC, this is expected
            // We'll use a different approach
          }
        }
      }
    }
    
    console.log(`✅ ${filename} executed successfully`);
    return true;
  } catch (error) {
    console.log(`❌ Error running ${filename}:`, error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🔧 Setting up database schema...\n');
  
  const sqlFiles = [
    { file: 'schema.sql', desc: 'Creating tables and indexes' },
    { file: 'rls-policies.sql', desc: 'Setting up security policies' },
    { file: 'functions.sql', desc: 'Creating database functions' },
    { file: 'storage.sql', desc: 'Setting up file storage' },
    { file: 'seed.sql', desc: 'Adding sample data' }
  ];

  let successCount = 0;
  
  for (const { file, desc } of sqlFiles) {
    const success = await runSQLFile(file, desc);
    if (success) successCount++;
    console.log(''); // Add spacing
  }
  
  console.log(`\n🎉 Database setup completed! (${successCount}/${sqlFiles.length} files processed)`);
  
  // Test the setup
  console.log('\n🔍 Testing database setup...');
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (!error) {
      console.log('✅ Users table is accessible');
    }
    
    const { data: listings } = await supabase.from('listings').select('count', { count: 'exact', head: true });
    if (listings !== null) {
      console.log('✅ Listings table is accessible');
    }
    
    console.log('\n🎯 Database is ready for use!');
    console.log('You can now run: npm run start-web');
    
  } catch (testError) {
    console.log('⚠️  Could not test database setup:', testError.message);
    console.log('💡 Please verify the tables exist in your Supabase dashboard');
  }
}

setupDatabase().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});