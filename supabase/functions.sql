-- VungTauLand Database Functions & Triggers
-- Run this AFTER rls-policies.sql

-- ============================================
-- FUNCTION: Increment listing views
-- ============================================
CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE listings
  SET views_count = views_count + 1
  WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Update conversation last message
-- ============================================
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating conversation on new message
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- FUNCTION: Create contact history automatically
-- ============================================
CREATE OR REPLACE FUNCTION create_contact_history_on_message()
RETURNS TRIGGER AS $$
DECLARE
  conv_record RECORD;
BEGIN
  SELECT listing_id, user_id, broker_id
  INTO conv_record
  FROM conversations
  WHERE id = NEW.conversation_id;
  
  INSERT INTO contact_history (listing_id, user_id, broker_id, contact_type)
  VALUES (conv_record.listing_id, conv_record.user_id, conv_record.broker_id, 'chat')
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for creating contact history on first message
CREATE TRIGGER trigger_create_contact_history
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION create_contact_history_on_message();

-- ============================================
-- FUNCTION: Get recommended listings by location
-- ============================================
CREATE OR REPLACE FUNCTION get_recommended_listings(
  user_lat NUMERIC,
  user_lng NUMERIC,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type listing_type,
  title TEXT,
  description TEXT,
  price BIGINT,
  area NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  direction TEXT,
  address TEXT,
  district TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  images TEXT[],
  is_hot BOOLEAN,
  status listing_status,
  views_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.*,
    SQRT(
      POW(69.1 * (l.latitude - user_lat), 2) +
      POW(69.1 * (user_lng - l.longitude) * COS(l.latitude / 57.3), 2)
    ) AS distance
  FROM listings l
  WHERE l.status = 'active'
  ORDER BY 
    l.is_hot DESC,
    distance ASC,
    l.created_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get broker statistics
-- ============================================
CREATE OR REPLACE FUNCTION get_broker_statistics(broker_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_listings', (
      SELECT COUNT(*) FROM listings WHERE user_id = broker_uuid
    ),
    'active_listings', (
      SELECT COUNT(*) FROM listings WHERE user_id = broker_uuid AND status = 'active'
    ),
    'total_views', (
      SELECT COALESCE(SUM(views_count), 0) FROM listings WHERE user_id = broker_uuid
    ),
    'total_contacts', (
      SELECT COUNT(*) FROM contact_history WHERE broker_id = broker_uuid
    ),
    'contacts_this_month', (
      SELECT COUNT(*) FROM contact_history 
      WHERE broker_id = broker_uuid 
      AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Search listings with filters
-- ============================================
CREATE OR REPLACE FUNCTION search_listings(
  search_query TEXT DEFAULT NULL,
  listing_type listing_type DEFAULT NULL,
  min_price BIGINT DEFAULT NULL,
  max_price BIGINT DEFAULT NULL,
  min_area NUMERIC DEFAULT NULL,
  max_area NUMERIC DEFAULT NULL,
  district_filter TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type listing_type,
  title TEXT,
  description TEXT,
  price BIGINT,
  area NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  direction TEXT,
  address TEXT,
  district TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  images TEXT[],
  is_hot BOOLEAN,
  status listing_status,
  views_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT l.*
  FROM listings l
  WHERE l.status = 'active'
    AND (search_query IS NULL OR l.title ILIKE '%' || search_query || '%' OR l.address ILIKE '%' || search_query || '%')
    AND (listing_type IS NULL OR l.type = listing_type)
    AND (min_price IS NULL OR l.price >= min_price)
    AND (max_price IS NULL OR l.price <= max_price)
    AND (min_area IS NULL OR l.area >= min_area)
    AND (max_area IS NULL OR l.area <= max_area)
    AND (district_filter IS NULL OR l.district = district_filter)
  ORDER BY l.is_hot DESC, l.created_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get user favorites with listing details
-- ============================================
CREATE OR REPLACE FUNCTION get_user_favorites(user_uuid UUID)
RETURNS TABLE (
  favorite_id UUID,
  favorite_created_at TIMESTAMP WITH TIME ZONE,
  listing_id UUID,
  user_id UUID,
  type listing_type,
  title TEXT,
  description TEXT,
  price BIGINT,
  area NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  direction TEXT,
  address TEXT,
  district TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  images TEXT[],
  is_hot BOOLEAN,
  status listing_status,
  views_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id AS favorite_id,
    f.created_at AS favorite_created_at,
    l.*
  FROM favorites f
  JOIN listings l ON f.listing_id = l.id
  WHERE f.user_id = user_uuid
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Increment news views
-- ============================================
CREATE OR REPLACE FUNCTION increment_news_views(news_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE news
  SET views_count = views_count + 1
  WHERE id = news_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
