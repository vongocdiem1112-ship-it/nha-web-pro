#!/usr/bin/env python3
"""
VungTauLand Database Setup using Supabase Python Client
This script creates sample data and tests the database connection.
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

def get_supabase_client() -> Client:
    """Create and return Supabase client"""
    url = os.getenv("EXPO_PUBLIC_SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        print("❌ Missing Supabase credentials in .env file")
        sys.exit(1)
    
    return create_client(url, key)

def create_sample_data(supabase: Client):
    """Create sample users and listings"""
    print("📝 Creating sample data...")
    
    # Sample users
    sample_users = [
        {
            "email": "broker@vungtauland.com",
            "full_name": "Nguyễn Văn An",
            "phone": "0901234567",
            "role": "broker",
            "social_links": {"zalo": "0901234567", "facebook": "nguyenvanan"}
        },
        {
            "email": "user@vungtauland.com", 
            "full_name": "Trần Thị Bình",
            "phone": "0987654321",
            "role": "user",
            "social_links": {}
        },
        {
            "email": "admin@vungtauland.com",
            "full_name": "Admin VungTauLand",
            "phone": "0912345678", 
            "role": "admin",
            "social_links": {}
        }
    ]
    
    # Insert users
    try:
        for user in sample_users:
            try:
                result = supabase.table("users").insert(user).execute()
                print(f"  ✅ Created user: {user['full_name']}")
            except Exception as e:
                if "duplicate key" in str(e).lower():
                    print(f"  ℹ️  User already exists: {user['full_name']}")
                else:
                    print(f"  ❌ Error creating user {user['full_name']}: {e}")
    except Exception as e:
        print(f"❌ Error in user creation: {e}")
        return False
    
    # Get broker user for listings
    try:
        broker_result = supabase.table("users").select("id").eq("role", "broker").limit(1).execute()
        if not broker_result.data:
            print("❌ No broker found for creating sample listings")
            return False
            
        broker_id = broker_result.data[0]["id"]
        
        # Sample listings
        sample_listings = [
            {
                "user_id": broker_id,
                "type": "nha",
                "title": "Nhà phố 2 tầng gần biển Vũng Tàu",
                "description": "Nhà phố đẹp, 2 tầng, gần biển, tiện ích đầy đủ. Vị trí thuận lợi, giao thông dễ dàng. Phù hợp cho gia đình hoặc đầu tư.",
                "price": 2500000000,
                "area": 80,
                "bedrooms": 3,
                "bathrooms": 2,
                "address": "123 Đường Hạ Long, Phường 1",
                "district": "Vũng Tàu",
                "city": "Bà Rịa - Vũng Tàu",
                "latitude": 10.3460,
                "longitude": 107.0843,
                "images": [
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
                    "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a"
                ],
                "is_hot": True,
                "status": "active"
            },
            {
                "user_id": broker_id,
                "type": "dat",
                "title": "Đất nền dự án Golden City",
                "description": "Đất nền vị trí đẹp, pháp lý rõ ràng, đầu tư sinh lời cao. Hạ tầng hoàn thiện, tiện ích xung quanh đầy đủ.",
                "price": 1800000000,
                "area": 100,
                "address": "Đường số 7, Khu đô thị Golden City",
                "district": "Bà Rịa",
                "city": "Bà Rịa - Vũng Tàu", 
                "latitude": 10.5117,
                "longitude": 107.1839,
                "images": [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
                ],
                "is_hot": False,
                "status": "active"
            },
            {
                "user_id": broker_id,
                "type": "chung_cu",
                "title": "Chung cư Ocean View - View biển tuyệt đẹp",
                "description": "Căn hộ cao cấp view biển, nội thất hiện đại, đầy đủ tiện ích. An ninh 24/7, bể bơi, gym, siêu thị.",
                "price": 3200000000,
                "area": 95,
                "bedrooms": 2,
                "bathrooms": 2,
                "address": "Tầng 15, Tòa A, Ocean View",
                "district": "Vũng Tàu",
                "city": "Bà Rịa - Vũng Tàu",
                "latitude": 10.3415,
                "longitude": 107.0924,
                "images": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
                ],
                "is_hot": True,
                "status": "active"
            }
        ]
        
        # Insert listings
        for listing in sample_listings:
            try:
                result = supabase.table("listings").insert(listing).execute()
                print(f"  ✅ Created listing: {listing['title'][:50]}...")
            except Exception as e:
                print(f"  ⚠️  Listing might already exist: {listing['title'][:30]}...")
                
    except Exception as e:
        print(f"❌ Error creating listings: {e}")
        return False
    
    return True

def test_database_operations(supabase: Client):
    """Test various database operations"""
    print("\n🔍 Testing database operations...")
    
    try:
        # Test users table
        users = supabase.table("users").select("*").execute()
        print(f"✅ Users table: {len(users.data)} records")
        
        # Test listings table
        listings = supabase.table("listings").select("*").execute()  
        print(f"✅ Listings table: {len(listings.data)} records")
        
        # Test listings with user join
        listings_with_users = supabase.table("listings").select("*, users(full_name, phone)").execute()
        print(f"✅ Listings with user data: {len(listings_with_users.data)} records")
        
        # Test search functionality
        search_results = supabase.table("listings").select("*").ilike("title", "%nhà%").execute()
        print(f"✅ Search results for 'nhà': {len(search_results.data)} records")
        
        # Test filtering by type
        house_listings = supabase.table("listings").select("*").eq("type", "nha").execute()
        print(f"✅ House listings: {len(house_listings.data)} records")
        
        # Test favorites table (create a sample favorite)
        if users.data and listings.data:
            user_id = users.data[0]["id"]
            listing_id = listings.data[0]["id"]
            
            try:
                favorite = supabase.table("favorites").insert({
                    "user_id": user_id,
                    "listing_id": listing_id
                }).execute()
                print("✅ Favorites table: Sample favorite created")
            except Exception as e:
                if "duplicate key" in str(e).lower():
                    print("ℹ️  Favorites table: Sample favorite already exists")
                else:
                    print(f"⚠️  Favorites table: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def main():
    """Main function"""
    print("🏗️  VungTauLand Database Setup & Test")
    print("=" * 45)
    
    try:
        # Create Supabase client
        supabase = get_supabase_client()
        print("✅ Supabase client created successfully")
        
        # Create sample data
        print("\n📊 Setting up sample data...")
        data_success = create_sample_data(supabase)
        
        # Test database operations
        test_success = test_database_operations(supabase)
        
        if data_success and test_success:
            print("\n🎉 Database setup and testing completed successfully!")
            print("🚀 Your VungTauLand app is ready to use!")
            print("💡 Run: npm run start-web")
            print("\n📱 Sample accounts created:")
            print("   - Broker: broker@vungtauland.com")
            print("   - User: user@vungtauland.com") 
            print("   - Admin: admin@vungtauland.com")
            return True
        else:
            print("\n⚠️  Setup completed with some issues")
            return False
            
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)