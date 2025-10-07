#!/usr/bin/env python3
"""
VungTauLand Database Setup Script using Python & psycopg2
This script will create the complete database schema for the real estate app.
"""

import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

def get_db_connection():
    """Extract database connection details from Supabase URL"""
    supabase_url = os.getenv('EXPO_PUBLIC_SUPABASE_URL', '')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
    
    if not supabase_url or not service_key:
        print("❌ Missing Supabase credentials in .env file")
        sys.exit(1)
    
    # Extract project reference from URL
    # https://zewyoonmkknfbgrmsfhw.supabase.co -> zewyoonmkknfbgrmsfhw
    project_ref = supabase_url.replace('https://', '').replace('.supabase.co', '')
    
    # Supabase connection details
    connection_params = {
        'host': f'db.{project_ref}.supabase.co',
        'database': 'postgres',
        'user': 'postgres',
        'password': service_key,  # Service role key is the password
        'port': 5432,
        'sslmode': 'require'
    }
    
    return connection_params

def execute_sql_statements(cursor, statements, description):
    """Execute a list of SQL statements"""
    print(f"📝 {description}...")
    success_count = 0
    
    for i, sql in enumerate(statements):
        try:
            # Clean up the SQL statement
            sql = sql.strip()
            if not sql or sql.startswith('--'):
                continue
                
            cursor.execute(sql)
            success_count += 1
            print(f"  ✅ Statement {i+1}/{len(statements)}")
            
        except psycopg2.Error as e:
            # Some errors are expected (like "already exists")
            if "already exists" in str(e) or "duplicate object" in str(e):
                print(f"  ℹ️  Statement {i+1}/{len(statements)} (already exists)")
                success_count += 1
            else:
                print(f"  ❌ Statement {i+1}/{len(statements)}: {e}")
    
    print(f"✅ {description} completed: {success_count}/{len(statements)} statements\n")
    return success_count

def create_database_schema():
    """Create the complete database schema"""
    
    # SQL statements to create the schema
    extensions_and_types = [
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
        '''DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('user', 'broker', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;''',
        '''DO $$ BEGIN
            CREATE TYPE broker_status AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;''',
        '''DO $$ BEGIN
            CREATE TYPE listing_type AS ENUM ('nha', 'dat', 'chung_cu', 'cho_thue');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;''',
        '''DO $$ BEGIN
            CREATE TYPE listing_status AS ENUM ('active', 'hidden', 'sold', 'rented');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;''',
        '''DO $$ BEGIN
            CREATE TYPE contact_type AS ENUM ('call', 'chat', 'view');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;''',
        '''DO $$ BEGIN
            CREATE TYPE news_category AS ENUM ('thi_truong', 'phan_tich', 'du_an');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;'''
    ]
    
    table_creation = [
        '''CREATE TABLE IF NOT EXISTS users (
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
        );''',
        
        '''CREATE TABLE IF NOT EXISTS listings (
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
        );''',
        
        '''CREATE TABLE IF NOT EXISTS favorites (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, listing_id)
        );''',
        
        '''CREATE TABLE IF NOT EXISTS conversations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            last_message TEXT,
            last_message_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(listing_id, user_id, broker_id)
        );''',
        
        '''CREATE TABLE IF NOT EXISTS messages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            image_url TEXT,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );''',
        
        '''CREATE TABLE IF NOT EXISTS contact_history (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            contact_type contact_type NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );''',
        
        '''CREATE TABLE IF NOT EXISTS news (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            content TEXT NOT NULL,
            image_url TEXT,
            category news_category NOT NULL,
            views_count INTEGER DEFAULT 0,
            published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );''',
        
        '''CREATE TABLE IF NOT EXISTS view_history (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );'''
    ]
    
    indexes = [
        'CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);',
        'CREATE INDEX IF NOT EXISTS idx_listings_district ON listings(district);',
        'CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);',
        'CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);',
        'CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);',
        'CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);',
        'CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(latitude, longitude);',
        'CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);',
        'CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);',
        'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id, created_at DESC);',
        'CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);',
        'CREATE INDEX IF NOT EXISTS idx_contact_history_broker_id ON contact_history(broker_id, created_at DESC);',
        'CREATE INDEX IF NOT EXISTS idx_contact_history_listing_id ON contact_history(listing_id);',
        'CREATE INDEX IF NOT EXISTS idx_view_history_user_id ON view_history(user_id, created_at DESC);',
        'CREATE INDEX IF NOT EXISTS idx_view_history_listing_id ON view_history(listing_id);',
        'CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);',
        'CREATE INDEX IF NOT EXISTS idx_conversations_broker_id ON conversations(broker_id);'
    ]
    
    sample_data = [
        '''INSERT INTO users (email, full_name, phone, role, broker_status) 
           VALUES ('demo@vungtauland.com', 'Demo Broker', '0901234567', 'broker', 'approved')
           ON CONFLICT (email) DO NOTHING;''',
           
        '''INSERT INTO users (email, full_name, phone, role) 
           VALUES ('user@vungtauland.com', 'Demo User', '0987654321', 'user')
           ON CONFLICT (email) DO NOTHING;'''
    ]
    
    # Connect to database
    try:
        conn_params = get_db_connection()
        print(f"🔌 Connecting to Supabase PostgreSQL...")
        print(f"   Host: {conn_params['host']}")
        
        conn = psycopg2.connect(**conn_params)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        print("✅ Connected successfully!\n")
        
        # Execute schema creation
        execute_sql_statements(cursor, extensions_and_types, "Creating extensions and types")
        execute_sql_statements(cursor, table_creation, "Creating tables")
        execute_sql_statements(cursor, indexes, "Creating indexes")
        execute_sql_statements(cursor, sample_data, "Inserting sample data")
        
        # Test the setup
        print("🔍 Testing database setup...")
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        print(f"✅ Users table: {user_count} records")
        
        cursor.execute("SELECT COUNT(*) FROM listings;")
        listing_count = cursor.fetchone()[0]
        print(f"✅ Listings table: {listing_count} records")
        
        # Add sample listing
        try:
            cursor.execute("SELECT id FROM users WHERE role = 'broker' LIMIT 1;")
            broker_id = cursor.fetchone()
            
            if broker_id:
                sample_listing = '''
                INSERT INTO listings (user_id, type, title, description, price, area, bedrooms, bathrooms, 
                                    address, district, latitude, longitude, images, is_hot, status)
                VALUES (%s, 'nha', 'Nhà phố 2 tầng gần biển Vũng Tàu', 
                        'Nhà phố đẹp, gần biển, tiện ích đầy đủ, vị trí thuận lợi', 
                        2500000000, 80, 3, 2, '123 Đường Hạ Long', 'Vũng Tàu', 
                        10.3460, 107.0843, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994'], 
                        true, 'active')
                ON CONFLICT DO NOTHING;
                '''
                cursor.execute(sample_listing, (broker_id[0],))
                print("✅ Sample listing created")
        except Exception as e:
            print(f"ℹ️  Sample listing creation: {e}")
        
        cursor.close()
        conn.close()
        
        print("\n🎉 Database setup completed successfully!")
        print("🚀 Your VungTauLand app is ready to use!")
        print("💡 Run: npm run start-web")
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database connection error: {e}")
        print("💡 Please check your Supabase credentials and network connection")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🏗️  VungTauLand Database Setup")
    print("=" * 40)
    
    success = create_database_schema()
    sys.exit(0 if success else 1)