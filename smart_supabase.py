#!/usr/bin/env python3
"""
Smart Supabase Connection Manager
Automatically chooses the best connection method and handles all database operations
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from supabase import create_client, Client
from dotenv import load_dotenv
import json

load_dotenv()

class SmartSupabaseManager:
    """Intelligent Supabase connection manager that automatically selects best method"""
    
    def __init__(self):
        self.url = os.getenv("EXPO_PUBLIC_SUPABASE_URL")
        self.anon_key = os.getenv("EXPO_PUBLIC_SUPABASE_ANON_KEY") 
        self.service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.db_url = os.getenv("SUPABASE_DB_URL")
        self.project_ref = os.getenv("SUPABASE_PROJECT_REF", "zewyoonmkknfbgrmsfhw")
        
        self.pg_conn = None
        self.supabase_client = None
        self.connection_method = None
        
    def get_postgres_connection(self):
        """Get direct PostgreSQL connection - PREFERRED METHOD"""
        try:
            if not self.pg_conn or self.pg_conn.closed:
                self.pg_conn = psycopg2.connect(self.db_url)
                self.pg_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                self.connection_method = "postgresql"
            return self.pg_conn
        except Exception as e:
            print(f"⚠️  PostgreSQL connection failed: {e}")
            return None
    
    def get_supabase_client(self, use_service_key=True):
        """Get Supabase client - FALLBACK METHOD"""
        try:
            key = self.service_key if use_service_key else self.anon_key
            if not self.supabase_client:
                self.supabase_client = create_client(self.url, key)
                self.connection_method = "supabase_client"
            return self.supabase_client
        except Exception as e:
            print(f"⚠️  Supabase client connection failed: {e}")
            return None
    
    def execute_sql(self, sql, description="SQL execution"):
        """Execute raw SQL using the best available method"""
        print(f"📝 {description}...", end="")
        
        # Method 1: Direct PostgreSQL (BEST)
        pg_conn = self.get_postgres_connection()
        if pg_conn:
            try:
                cursor = pg_conn.cursor()
                cursor.execute(sql)
                result = cursor.fetchall() if cursor.description else None
                cursor.close()
                print(" ✅ (PostgreSQL)")
                return True, result
            except Exception as e:
                print(f" ❌ PostgreSQL: {str(e)[:50]}...")
        
        print(" ❌ (No working connection)")
        return False, None
    
    def insert_data(self, table, data, description="Data insertion"):
        """Insert data using the best available method"""
        print(f"📊 {description}...", end="")
        
        # Method 1: Try Supabase client (BEST for data operations)
        client = self.get_supabase_client()
        if client:
            try:
                result = client.table(table).insert(data).execute()
                if result.data:
                    print(" ✅ (Supabase Client)")
                    return True, result.data
                else:
                    print(" ⚠️  (Might already exist)")
                    return True, None
            except Exception as e:
                if "duplicate key" in str(e).lower() or "already exists" in str(e).lower():
                    print(" ℹ️  (Already exists)")
                    return True, None
                print(f" ❌ Supabase: {str(e)[:50]}...")
        
        # Method 2: Direct PostgreSQL
        pg_conn = self.get_postgres_connection()
        if pg_conn and isinstance(data, dict):
            try:
                cursor = pg_conn.cursor()
                columns = list(data.keys())
                values = list(data.values())
                placeholders = ", ".join(["%s"] * len(values))
                sql = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders}) ON CONFLICT DO NOTHING;"
                cursor.execute(sql, values)
                cursor.close()
                print(" ✅ (PostgreSQL)")
                return True, None
            except Exception as e:
                print(f" ❌ PostgreSQL: {str(e)[:50]}...")
        
        print(" ❌ (No working method)")
        return False, None
    
    def test_connection(self):
        """Test all connection methods and return status"""
        print("🔍 Testing Supabase connections...")
        
        methods = []
        
        # Test PostgreSQL
        pg_conn = self.get_postgres_connection()
        if pg_conn:
            try:
                cursor = pg_conn.cursor()
                cursor.execute("SELECT 1;")
                cursor.fetchone()
                cursor.close()
                methods.append("✅ PostgreSQL Direct (PREFERRED)")
            except:
                methods.append("❌ PostgreSQL Direct")
        else:
            methods.append("❌ PostgreSQL Direct")
        
        # Test Supabase client
        client = self.get_supabase_client()
        if client:
            try:
                result = client.table("users").select("count", count="exact", head=True).execute()
                methods.append("✅ Supabase Client")
            except:
                methods.append("❌ Supabase Client")
        else:
            methods.append("❌ Supabase Client")
        
        for method in methods:
            print(f"   {method}")
        
        return any("✅" in method for method in methods)
    
    def get_table_counts(self):
        """Get record counts for all tables"""
        tables = ["users", "listings", "favorites", "conversations", "messages", "contact_history", "news", "view_history"]
        counts = {}
        
        # Try PostgreSQL first
        pg_conn = self.get_postgres_connection()
        if pg_conn:
            try:
                cursor = pg_conn.cursor()
                for table in tables:
                    cursor.execute(f"SELECT COUNT(*) FROM {table};")
                    counts[table] = cursor.fetchone()[0]
                cursor.close()
                return counts
            except Exception as e:
                print(f"⚠️  PostgreSQL count failed: {e}")
        
        # Fallback to Supabase client
        client = self.get_supabase_client()
        if client:
            for table in tables:
                try:
                    result = client.table(table).select("*", count="exact", head=True).execute()
                    counts[table] = result.count or 0
                except:
                    counts[table] = -1  # Error
        
        return counts
    
    def close(self):
        """Close all connections"""
        if self.pg_conn and not self.pg_conn.closed:
            self.pg_conn.close()

def quick_supabase_test():
    """Quick test of Supabase connections"""
    print("🚀 VungTauLand Supabase Connection Test")
    print("=" * 45)
    
    manager = SmartSupabaseManager()
    
    # Test connections
    if not manager.test_connection():
        print("❌ No working connections found!")
        return False
    
    # Get table counts
    print(f"\n📊 Database Status:")
    counts = manager.get_table_counts()
    
    for table, count in counts.items():
        if count >= 0:
            print(f"✅ {table:15}: {count:3} records")
        else:
            print(f"❌ {table:15}: ERROR")
    
    total_records = sum(c for c in counts.values() if c >= 0)
    print(f"\n📈 Total records: {total_records}")
    
    if total_records > 0:
        print("🎉 Database is ready and populated!")
        print("💡 Run: npm run start-web")
        return True
    else:
        print("⚠️  Database is empty, run setup script first")
        return False

def create_supabase_schema():
    """Create complete schema using the smart manager"""
    print("🏗️  Creating Supabase Schema (Smart Method)")
    print("=" * 50)
    
    manager = SmartSupabaseManager()
    
    if not manager.test_connection():
        print("❌ No working connections available!")
        return False
    
    # Schema creation steps
    schema_steps = [
        ('Enable UUID Extension', 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        ('User Role Enum', '''
        DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('user', 'broker', 'admin');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        '''),
        ('Listing Type Enum', '''
        DO $$ BEGIN
            CREATE TYPE listing_type AS ENUM ('nha', 'dat', 'chung_cu', 'cho_thue');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        '''),
        ('Listing Status Enum', '''
        DO $$ BEGIN
            CREATE TYPE listing_status AS ENUM ('active', 'hidden', 'sold', 'rented');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        '''),
        ('Users Table', '''
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
        '''),
        ('Listings Table', '''
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
            images TEXT[] DEFAULT ARRAY[]::TEXT[],
            is_hot BOOLEAN DEFAULT FALSE,
            status listing_status DEFAULT 'active' NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        '''),
        ('Favorites Table', '''
        CREATE TABLE IF NOT EXISTS favorites (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, listing_id)
        );
        '''),
        ('News Table', '''
        CREATE TABLE IF NOT EXISTS news (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            content TEXT NOT NULL,
            image_url TEXT,
            category TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        '''),
    ]
    
    # Execute schema
    success_count = 0
    for description, sql in schema_steps:
        success, _ = manager.execute_sql(sql, description)
        if success:
            success_count += 1
    
    print(f"\n✅ Schema: {success_count}/{len(schema_steps)} successful")
    
    # Add sample data
    sample_users = [
        {"email": "admin@vungtauland.com", "full_name": "Admin VungTauLand", "role": "admin"},
        {"email": "broker@vungtauland.com", "full_name": "Nguyễn Văn An", "role": "broker"},
        {"email": "user@vungtauland.com", "full_name": "Khách hàng Demo", "role": "user"},
    ]
    
    for user in sample_users:
        manager.insert_data("users", user, f"User: {user['full_name']}")
    
    manager.close()
    print(f"\n🎉 Smart Supabase setup completed!")
    return True

if __name__ == "__main__":
    # Run quick test
    success = quick_supabase_test()
    
    if not success:
        print(f"\n🔧 Running schema creation...")
        create_supabase_schema()
        print(f"\n🔍 Re-testing...")
        quick_supabase_test()
    
    sys.exit(0)