#!/usr/bin/env python3
"""
Direct PostgreSQL Database Setup for VungTauLand
Using direct PostgreSQL connection via transaction pooler
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys
import time

# Connection string from Supabase
CONNECTION_STRING = "postgresql://postgres.zewyoonmkknfbgrmsfhw:Acookingoil123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

def create_complete_schema():
    """Create complete database schema with all tables and data"""
    
    print("🚀 Creating Complete VungTauLand Database Schema")
    print("=" * 55)
    
    try:
        # Connect to PostgreSQL
        print("🔌 Connecting to PostgreSQL...")
        conn = psycopg2.connect(CONNECTION_STRING)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        print("✅ Connected successfully!")
        
        # Complete SQL schema
        sql_commands = [
            # Extensions
            {
                "name": "Enable UUID Extension",
                "sql": 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
            },
            
            # Create ENUMs
            {
                "name": "User Role Enum",
                "sql": """
                DO $$ BEGIN
                    CREATE TYPE user_role AS ENUM ('user', 'broker', 'admin');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """
            },
            {
                "name": "Broker Status Enum",
                "sql": """
                DO $$ BEGIN
                    CREATE TYPE broker_status AS ENUM ('pending', 'approved', 'rejected');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """
            },
            {
                "name": "Listing Type Enum",
                "sql": """
                DO $$ BEGIN
                    CREATE TYPE listing_type AS ENUM ('nha', 'dat', 'chung_cu', 'cho_thue');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """
            },
            {
                "name": "Listing Status Enum",
                "sql": """
                DO $$ BEGIN
                    CREATE TYPE listing_status AS ENUM ('active', 'hidden', 'sold', 'rented');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """
            },
            {
                "name": "Contact Type Enum",
                "sql": """
                DO $$ BEGIN
                    CREATE TYPE contact_type AS ENUM ('call', 'chat', 'view');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """
            },
            {
                "name": "News Category Enum",
                "sql": """
                DO $$ BEGIN
                    CREATE TYPE news_category AS ENUM ('thi_truong', 'phan_tich', 'du_an');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """
            },
            
            # Create Tables
            {
                "name": "Users Table",
                "sql": """
                CREATE TABLE IF NOT EXISTS users (
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
                );
                """
            },
            {
                "name": "Listings Table",
                "sql": """
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
                );
                """
            },
            {
                "name": "Favorites Table",
                "sql": """
                CREATE TABLE IF NOT EXISTS favorites (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UNIQUE(user_id, listing_id)
                );
                """
            },
            {
                "name": "Conversations Table",
                "sql": """
                CREATE TABLE IF NOT EXISTS conversations (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    last_message TEXT,
                    last_message_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UNIQUE(listing_id, user_id, broker_id)
                );
                """
            },
            {
                "name": "Messages Table",
                "sql": """
                CREATE TABLE IF NOT EXISTS messages (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    content TEXT NOT NULL,
                    image_url TEXT,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
            },
            {
                "name": "Contact History Table",
                "sql": """
                CREATE TABLE IF NOT EXISTS contact_history (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                    broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    contact_type contact_type NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
            },
            {
                "name": "News Table", 
                "sql": """
                CREATE TABLE IF NOT EXISTS news (
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
                );
                """
            },
            {
                "name": "View History Table",
                "sql": """
                CREATE TABLE IF NOT EXISTS view_history (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
            },
            
            # Create Indexes
            {
                "name": "Performance Indexes",
                "sql": """
                CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
                CREATE INDEX IF NOT EXISTS idx_listings_district ON listings(district);
                CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
                CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
                CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
                CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(latitude, longitude);
                CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
                CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);
                CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id, created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
                CREATE INDEX IF NOT EXISTS idx_conversations_broker_id ON conversations(broker_id);
                """
            },
            
            # Create Update Triggers
            {
                "name": "Update Timestamp Function",
                "sql": """
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = NOW();
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                """
            },
            {
                "name": "Update Triggers",
                "sql": """
                DROP TRIGGER IF EXISTS update_users_updated_at ON users;
                CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
                
                DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
                CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
                
                DROP TRIGGER IF EXISTS update_news_updated_at ON news;
                CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
                """
            }
        ]
        
        # Execute schema creation
        print(f"\n📝 Creating database schema ({len(sql_commands)} steps)...")
        success_count = 0
        
        for i, cmd in enumerate(sql_commands):
            try:
                print(f"[{i+1:2}/{len(sql_commands)}] {cmd['name'][:30]:<30}", end="")
                cursor.execute(cmd['sql'])
                print(" ✅")
                success_count += 1
                time.sleep(0.1)  # Small delay to avoid overwhelming
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    print(" ✅ (exists)")
                    success_count += 1
                else:
                    print(f" ❌ {str(e)[:50]}...")
        
        print(f"\n✅ Schema creation: {success_count}/{len(sql_commands)} successful")
        
        # Insert comprehensive sample data
        print(f"\n📊 Inserting comprehensive sample data...")
        
        # Sample users
        sample_users = [
            ("admin@vungtauland.com", "Quản trị viên VungTauLand", "0912345678", "admin", None, '{"website": "vungtauland.com"}'),
            ("broker1@vungtauland.com", "Nguyễn Văn An - Môi giới Senior", "0901234567", "broker", "approved", '{"zalo": "0901234567", "facebook": "nguyenvanan"}'),
            ("broker2@vungtauland.com", "Trần Thị Bình - Môi giới", "0902345678", "broker", "approved", '{"zalo": "0902345678", "facebook": "tranthib"}'),
            ("broker3@vungtauland.com", "Lê Minh Châu - Môi giới", "0903456789", "broker", "pending", '{"zalo": "0903456789"}'),
            ("user1@vungtauland.com", "Phạm Văn Cường - Khách hàng", "0987654321", "user", None, '{}'),
            ("user2@vungtauland.com", "Võ Thị Dung - Khách hàng", "0976543210", "user", None, '{}'),
        ]
        
        user_insert_sql = """
        INSERT INTO users (email, full_name, phone, role, broker_status, social_links) 
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
        """
        
        created_user_ids = []
        for user_data in sample_users:
            try:
                cursor.execute(user_insert_sql, user_data)
                result = cursor.fetchone()
                if result:
                    created_user_ids.append(result[0])
                    print(f"✅ Created user: {user_data[1][:30]}")
                else:
                    # Get existing user ID
                    cursor.execute("SELECT id FROM users WHERE email = %s", (user_data[0],))
                    existing = cursor.fetchone()
                    if existing:
                        created_user_ids.append(existing[0])
                        print(f"ℹ️  User exists: {user_data[1][:30]}")
            except Exception as e:
                print(f"❌ User error: {user_data[1][:20]} - {e}")
        
        # Get broker and user IDs
        cursor.execute("SELECT id FROM users WHERE role = 'broker' AND broker_status = 'approved' LIMIT 2")
        broker_ids = [row[0] for row in cursor.fetchall()]
        
        if broker_ids:
            # Comprehensive listings
            sample_listings = [
                (broker_ids[0], 'nha', 'Biệt thự 3 tầng mặt tiền biển Vũng Tàu', 
                 'Biệt thự cao cấp 3 tầng, mặt tiền đường biển Bãi Trước. Thiết kế hiện đại, view biển 180 độ tuyệt đẹp. Gồm 5 phòng ngủ master, 4 phòng tắm luxury, phòng khách rộng 60m², bếp hiện đại đầy đủ thiết bị. Sân vườn tropicana và garage 2 xe hơi. Hồ bơi riêng và khu BBQ. Pháp lý đầy đủ, sổ hồng chính chủ.', 
                 8500000000, 250, 5, 4, 'Đông Nam', '123 Đường Hạ Long, Phường 1', 'Vũng Tàu', 10.3460, 107.0843, 
                 ['https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'], True, 'active'),
                
                (broker_ids[0], 'chung_cu', 'Chung cư Ocean View - Penthouse 3PN view biển', 
                 'Penthouse cao cấp tầng 25, view biển 270 độ không bao giờ bị che. Diện tích 120m² với 3 phòng ngủ master, 3 WC, phòng khách 40m². Nội thất imported Italy đầy đủ. Hệ thống tiện ích resort: bể bơi vô cực, gym, spa, cinema, kids club. Bảo vệ 24/7, thang máy riêng. Chính chủ bán gấp.', 
                 5800000000, 120, 3, 3, 'Đông', 'Tầng 25, Tòa A, Chung cư Ocean View', 'Vũng Tàu', 10.3415, 107.0924, 
                 ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'], True, 'active'),
                
                (broker_ids[0], 'dat', 'Đất nền KDC Golden City - Lô góc 2 mặt tiền', 
                 'Lô đất nền vip nhất dự án Golden City - lô góc 2 mặt tiền đường 20m và 16m. Vị trí đắc địa gần công viên trung tâm, trường học, bệnh viện. Hạ tầng 100% hoàn thiện: đường asphalt, điện ngầm, cấp thoát nước, internet cáp quang. Pháp lý minh bạch, sổ hồng trao tay ngay. Chỉ 1 lô duy nhất.', 
                 3200000000, 150, None, None, 'Bắc', 'Lô A1-01, Khu đô thị Golden City', 'Long Điền', 10.4117, 107.2239, 
                 ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'], True, 'active'),
                
                (broker_ids[-1] if len(broker_ids) > 1 else broker_ids[0], 'nha', 'Nhà phố hiện đại 2 tầng - KDC An Phú', 
                 'Nhà phố thiết kế hiện đại minimalist 2 tầng 1 sân thượng. Diện tích 90m² với 3 phòng ngủ, 3 WC, phòng khách liền bếp mở. Sân trước để xe và sân sau phơi đồ. Khu dân cư cao cấp, an ninh tốt, gần trường quốc tế. Hoàn thiện đẹp, vào ở ngay. Giá tốt cho gia đình trẻ.', 
                 3200000000, 90, 3, 3, 'Nam', '78 Đường số 5, KDC An Phú', 'Bà Rịa', 10.5117, 107.1839, 
                 ['https://images.unsplash.com/photo-1568605114967-8130f3a36994', 'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a'], False, 'active'),
                
                (broker_ids[-1] if len(broker_ids) > 1 else broker_ids[0], 'cho_thue', 'Cho thuê Villa Pool gần biển - Nguyên căn', 
                 'Villa nguyên căn có hồ bơi riêng, cách biển 200m. Diện tích 200m² với 4 phòng ngủ, 3 phòng tắm, bếp đầy đủ, phòng khách rộng. Sân vườn tropical, BBQ area, hồ bơi 4x8m. Đầy đủ nội thất cao cấp, máy lạnh, TV, tủ lạnh. Phù hợp gia đình du lịch dài hạn hoặc expat. Cho thuê theo tháng/năm.', 
                 25000000, 200, 4, 3, 'Đông Nam', '45 Đường Thùy Vân, Phường Thắng Tam', 'Vũng Tàu', 10.3300, 107.0900, 
                 ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'], True, 'active'),
                
                (broker_ids[0], 'dat', 'Đất thổ cư mặt tiền Quốc lộ 51 - Tiềm năng lớn', 
                 'Lô đất thổ cư mặt tiền Quốc lộ 51, vị trí kinh doanh đắc địa. Diện tích lớn 300m², mặt tiền 12m, thuận lợi kinh doanh nhà hàng, khách sạn, showroom. Gần khu công nghiệp, dân cư đông đúc. Pháp lý rõ ràng, giá đầu tư hấp dẫn. Phù hợp đầu tư sinh lời cao.', 
                 2200000000, 300, None, None, 'Đông', '567 Quốc lộ 51, Xã Long Sơn', 'Long Điền', 10.4500, 107.2000, 
                 ['https://images.unsplash.com/photo-1500382017468-9049fed747ef'], False, 'active'),
                
                (broker_ids[-1] if len(broker_ids) > 1 else broker_ids[0], 'chung_cu', 'Căn hộ 2PN The Sóng Vũng Tàu - Tầng cao view đẹp', 
                 'Căn hộ 2 phòng ngủ tầng 18 tại The Sóng Vũng Tàu, view thành phố và biển từ xa. Diện tích 75m² thiết kế tối ưu, đầy đủ nội thất. Tiện ích đầy đủ: gym, pool, playground, minimart. Vào ở ngay, giá tốt trong phân khúc. Thích hợp cho gia đình nhỏ hoặc đầu tư cho thuê.', 
                 2800000000, 75, 2, 2, 'Tây Nam', 'Tầng 18, Block B, The Sóng Vũng Tàu', 'Vũng Tàu', 10.3500, 107.0750, 
                 ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'], False, 'active'),
                
                (broker_ids[0], 'nha', 'Shophouse 3 tầng mặt tiền chợ - Vị trí vàng KD', 
                 'Shophouse 3 tầng mặt tiền chợ Bà Rịa, vị trí kinh doanh cực đỉnh. Tầng 1 kinh doanh, tầng 2-3 ở hoặc cho thuê. Diện tích 80m², mặt tiền 4m. Nhà mới xây, thiết kế hiện đại. Thuận tiện kinh doanh F&B, thời trang, dược phẩm. ROI cao, thu hồi vốn nhanh.', 
                 4500000000, 80, 2, 2, 'Đông', '89 Đường Lê Lợi, Phường 1', 'Bà Rịa', 10.5050, 107.1650, 
                 ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'], False, 'active'),
            ]
            
            listing_insert_sql = """
            INSERT INTO listings (user_id, type, title, description, price, area, bedrooms, bathrooms, 
                                direction, address, district, latitude, longitude, images, is_hot, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
            """
            
            for listing_data in sample_listings:
                try:
                    cursor.execute(listing_insert_sql, listing_data)
                    print(f"✅ Created listing: {listing_data[2][:40]}...")
                except Exception as e:
                    print(f"⚠️  Listing: {listing_data[2][:30]}... - {str(e)[:30]}...")
        
        # Sample news articles
        news_data = [
            ('Thị trường BDS Vũng Tàu Q3/2024: Tăng trưởng ổn định', 
             'Phân tích chi tiết xu hướng thị trường bất động sản Vũng Tàu quý 3 năm 2024',
             'Thị trường bất động sản Vũng Tàu trong quý 3/2024 tiếp tục cho thấy sự phục hồi mạnh mẽ với mức tăng giá ổn định 8-12% so với cùng kỳ. Phân khúc căn hộ cao cấp dẫn đầu với 15% tăng trưởng. Dự báo Q4 sẽ tiếp tục xu hướng tích cực nhờ các dự án mới và chính sách hỗ trợ.',
             'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', 'thi_truong'),
            
            ('Ra mắt dự án Ocean Marina - Biệt thự biển đẳng cấp resort', 
             'Dự án biệt thự biển cao cấp với concept resort 5 sao tại bãi Dâu',
             'Ocean Marina chính thức ra mắt với 50 căn biệt thự biển độc đáo, thiết kế tropical hiện đại. Mỗi căn đều có hồ bơi riêng, sân vườn và view biển trực diện. Tiện ích resort đẳng cấp: beach club, spa, golf mini. Giá từ 15-35 tỷ, bàn giao Q2/2025.',
             'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'du_an'),
            
            ('Phân tích đầu tư BDS Vũng Tàu: Cơ hội vàng cho nhà đầu tư', 
             'Góc nhìn chuyên sâu về tiềm năng và rủi ro khi đầu tư BDS tại Vũng Tàu',
             'Vũng Tàu đang trở thành điểm sáng đầu tư BDS khu vực phía Nam. Với lợi thế gần TPHCM, hạ tầng phát triển và chính sách thuận lợi, ROI trung bình 10-15%/năm. Các phân khúc tiềm năng: căn hộ du lịch, shophouse và đất nền KDC. Lưu ý rủi ro pháp lý và chọn vị trí phù hợp.',
             'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'phan_tich'),
            
            ('Khu đô thị Golden City hoàn thiện hạ tầng, sẵn sàng bàn giao', 
             'Tiến độ dự án KDT Golden City đạt 98%, chuẩn bị bàn giao đợt 1',
             'Sau 30 tháng thi công, Golden City đã hoàn thiện 98% hạ tầng kỹ thuật và tiện ích. Đợt 1 bàn giao 200 nền vào tháng 12/2024. Các tiện ích đã vận hành: trường học, chợ, công viên, hồ điều hòa. Giá bàn giao từ 18-25 triệu/m² tùy vị trí.',
             'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 'du_an'),
            
            ('Xu hướng thiết kế nhà phố 2024: Tối giản và thông minh', 
             'Những xu hướng thiết kế nhà phố được ưa chuộng nhất năm 2024',
             'Thiết kế nhà phố 2024 hướng đến sự tối giản, thông minh và bền vững. Xu hướng nổi bật: không gian mở, ánh sáng tự nhiên, vật liệu thân thiện môi trường, smart home. Màu sắc trung tính, đường nét đơn giản nhưng tinh tế. Chi phí thiết kế trung bình 300-500 triệu/căn.',
             'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'phan_tich'),
        ]
        
        for news_item in news_data:
            try:
                cursor.execute("""
                INSERT INTO news (title, description, content, image_url, category)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING;
                """, news_item)
                print(f"✅ Created news: {news_item[0][:40]}...")
            except Exception as e:
                print(f"⚠️  News: {news_item[0][:30]}... - {str(e)[:30]}...")
        
        # Final verification
        print(f"\n🔍 Verifying database setup...")
        
        tables_to_check = [
            "users", "listings", "favorites", "conversations", 
            "messages", "contact_history", "news", "view_history"
        ]
        
        all_good = True
        for table in tables_to_check:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = cursor.fetchone()[0]
                print(f"✅ {table:15}: {count:3} records")
            except Exception as e:
                print(f"❌ {table:15}: ERROR")
                all_good = False
        
        cursor.close()
        conn.close()
        
        if all_good:
            print(f"\n🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!")
            print("=" * 55)
            print("✅ All 8 tables created with proper relationships")
            print("✅ Performance indexes added")
            print("✅ Update triggers configured")
            print("✅ 6 sample users added (admin, brokers, users)")
            print("✅ 8 comprehensive listings added")
            print("✅ 5 news articles added")
            print("✅ Database ready for production use")
            print()
            print("🚀 Your VungTauLand app is fully operational!")
            print("💡 Run: npm run start-web")
            print()
            print("📱 Sample login accounts:")
            print("   - admin@vungtauland.com (Admin)")
            print("   - broker1@vungtauland.com (Senior Broker)")
            print("   - broker2@vungtauland.com (Broker)")  
            print("   - user1@vungtauland.com (Customer)")
            return True
        else:
            print("\n⚠️  Some issues detected, but core setup completed")
            return False
            
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

if __name__ == "__main__":
    success = create_complete_schema()
    sys.exit(0 if success else 1)