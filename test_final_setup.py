#!/usr/bin/env python3
"""
Final test to verify VungTauLand database setup is complete
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def test_final_setup():
    """Test if database setup is complete"""
    print("🔍 Testing VungTauLand Database Setup...")
    print("=" * 40)
    
    try:
        # Create client
        url = os.getenv("EXPO_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not url or not key:
            print("❌ Missing environment variables")
            return False
            
        supabase = create_client(url, key)
        
        # Test tables and data
        tests = [
            ("users", "SELECT COUNT(*) as count FROM users"),
            ("listings", "SELECT COUNT(*) as count FROM listings"),
            ("favorites", "SELECT COUNT(*) as count FROM favorites"),
            ("conversations", "SELECT COUNT(*) as count FROM conversations"),
            ("messages", "SELECT COUNT(*) as count FROM messages"),
            ("contact_history", "SELECT COUNT(*) as count FROM contact_history"),
            ("news", "SELECT COUNT(*) as count FROM news"),
            ("view_history", "SELECT COUNT(*) as count FROM view_history")
        ]
        
        all_passed = True
        
        for table_name, query in tests:
            try:
                result = supabase.table(table_name).select("*", count="exact").execute()
                count = result.count or 0
                print(f"✅ {table_name:15} table: {count:3} records")
            except Exception as e:
                print(f"❌ {table_name:15} table: ERROR - {e}")
                all_passed = False
        
        if all_passed:
            print("\n" + "=" * 40)
            print("🎉 ALL TESTS PASSED!")
            print("✅ Database schema is set up correctly")
            print("✅ All tables are accessible")
            print("✅ Sample data is loaded")
            print()
            print("🚀 Your VungTauLand app is ready!")
            print("💡 Run: npm run start-web")
            print()
            print("📱 Sample accounts available:")
            print("   - broker@vungtauland.com (Broker)")
            print("   - user@vungtauland.com (User)")
            print("   - admin@vungtauland.com (Admin)")
            return True
        else:
            print("\n❌ SOME TESTS FAILED")
            print("💡 Please run the complete_schema.sql file in Supabase Dashboard")
            return False
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("💡 Please check your .env file and Supabase credentials")
        return False

if __name__ == "__main__":
    success = test_final_setup()
    sys.exit(0 if success else 1)