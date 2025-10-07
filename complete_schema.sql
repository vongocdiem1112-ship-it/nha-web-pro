-- VungTauLand Complete Database Schema
-- Run this entire script in Supabase Dashboard > SQL Editor

-- Step 1: Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create Custom Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'broker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE broker_status AS ENUM ('pending', 'approved', 'rejected');
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

DO $$ BEGIN
    CREATE TYPE contact_type AS ENUM ('call', 'chat', 'view');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE news_category AS ENUM ('thi_truong', 'phan_tich', 'du_an');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Create Tables

-- Users Table
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

-- Listings Table
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

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Conversations Table
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

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact History Table
CREATE TABLE IF NOT EXISTS contact_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_type contact_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Table
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

-- View History Table
CREATE TABLE IF NOT EXISTS view_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create Indexes for Performance
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
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_contact_history_broker_id ON contact_history(broker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_history_listing_id ON contact_history(listing_id);

CREATE INDEX IF NOT EXISTS idx_view_history_user_id ON view_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_view_history_listing_id ON view_history(listing_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_broker_id ON conversations(broker_id);

-- Step 5: Create Update Timestamp Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create Triggers for Updated At
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Insert Sample Data
INSERT INTO users (email, full_name, phone, role, broker_status, social_links) 
VALUES 
    ('broker@vungtauland.com', 'Nguyễn Văn An', '0901234567', 'broker', 'approved', '{"zalo": "0901234567", "facebook": "nguyenvanan"}'),
    ('user@vungtauland.com', 'Trần Thị Bình', '0987654321', 'user', null, '{}'),
    ('admin@vungtauland.com', 'Admin VungTauLand', '0912345678', 'admin', null, '{}')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Listings (using the broker user)
DO $$
DECLARE
    broker_user_id UUID;
BEGIN
    -- Get broker user ID
    SELECT id INTO broker_user_id FROM users WHERE email = 'broker@vungtauland.com';
    
    IF broker_user_id IS NOT NULL THEN
        INSERT INTO listings (user_id, type, title, description, price, area, bedrooms, bathrooms, address, district, latitude, longitude, images, is_hot, status)
        VALUES 
            (broker_user_id, 'nha', 'Nhà phố 2 tầng gần biển Vũng Tàu', 'Nhà phố đẹp, 2 tầng, gần biển, tiện ích đầy đủ. Vị trí thuận lợi, giao thông dễ dàng.', 2500000000, 80, 3, 2, '123 Đường Hạ Long, Phường 1', 'Vũng Tàu', 10.3460, 107.0843, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994', 'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a'], true, 'active'),
            (broker_user_id, 'dat', 'Đất nền dự án Golden City', 'Đất nền vị trí đẹp, pháp lý rõ ràng, đầu tư sinh lời cao. Hạ tầng hoàn thiện.', 1800000000, 100, null, null, 'Đường số 7, Khu đô thị Golden City', 'Bà Rịa', 10.5117, 107.1839, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64'], false, 'active'),
            (broker_user_id, 'chung_cu', 'Chung cư Ocean View - View biển tuyệt đẹp', 'Căn hộ cao cấp view biển, nội thất hiện đại, đầy đủ tiện ích. An ninh 24/7.', 3200000000, 95, 2, 2, 'Tầng 15, Tòa A, Ocean View', 'Vũng Tàu', 10.3415, 107.0924, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'], true, 'active')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert Sample News
INSERT INTO news (title, description, content, image_url, category)
VALUES 
    ('Thị trường BDS Vũng Tàu năm 2024', 'Tổng quan thị trường bất động sản Vũng Tàu trong năm 2024', 'Thị trường bất động sản Vũng Tàu đang có những chuyển biến tích cực...', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', 'thi_truong'),
    ('Dự án căn hộ cao cấp Ocean View', 'Dự án căn hộ mới với view biển tuyệt đẹp', 'Dự án Ocean View là một trong những dự án nổi bật nhất tại Vũng Tàu...', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'du_an'),
    ('Phân tích xu hướng đầu tư BDS 2024', 'Những xu hướng đầu tư bất động sản đáng chú ý', 'Các chuyên gia dự báo thị trường BDS sẽ có những biến động...', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 'phan_tich')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 VungTauLand database schema created successfully!';
    RAISE NOTICE '📊 Sample data inserted';
    RAISE NOTICE '🚀 Your app is ready to use!';
END $$;