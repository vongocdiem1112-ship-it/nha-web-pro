#!/usr/bin/env python3
"""
Auto Supabase Connection Tester & Fixer
This script automatically detects and fixes Supabase connection issues
"""

import os
import sys
from smart_supabase import SmartSupabaseManager
from dotenv import load_dotenv

load_dotenv()

def auto_supabase_fix():
    """Automatically detect and fix Supabase connection issues"""
    print("🔧 VungTauLand Auto Supabase Fixer")
    print("=" * 40)
    
    manager = SmartSupabaseManager()
    
    # Step 1: Test connections
    print("🔍 Testing all connection methods...")
    if manager.test_connection():
        print("✅ Connections working!")
        
        # Check if database has data
        counts = manager.get_table_counts()
        total_records = sum(c for c in counts.values() if c >= 0)
        
        if total_records > 0:
            print(f"✅ Database has {total_records} records")
            print("🎉 Everything is working perfectly!")
            return True
        else:
            print("⚠️  Database is empty, setting up data...")
            # Import and run the direct setup
            from direct_db_setup import create_complete_schema
            return create_complete_schema()
    else:
        print("❌ No working connections found!")
        print("💡 Please check your .env file credentials")
        return False

if __name__ == "__main__":
    success = auto_supabase_fix()
    if success:
        print("\n🚀 Run: npm run start-web")
    sys.exit(0 if success else 1)