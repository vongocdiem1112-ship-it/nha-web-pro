#!/usr/bin/env python3
"""
VungTauLand Database Setup Instructions
This script provides clear instructions for setting up the database.
"""

import os
from dotenv import load_dotenv

load_dotenv()

def print_setup_instructions():
    """Print detailed setup instructions"""
    
    supabase_url = os.getenv("EXPO_PUBLIC_SUPABASE_URL", "")
    project_ref = supabase_url.replace('https://', '').replace('.supabase.co', '') if supabase_url else "zewyoonmkknfbgrmsfhw"
    
    print("🏗️  VungTauLand Database Setup Instructions")
    print("=" * 50)
    print()
    
    print("📋 STEP 1: Access Supabase Dashboard")
    print("=" * 30)
    print(f"1. Open: https://app.supabase.com/project/{project_ref}")
    print("2. Login to your Supabase account")
    print("3. Navigate to 'SQL Editor' in the left sidebar")
    print()
    
    print("📝 STEP 2: Run Database Schema")
    print("=" * 30)
    print("1. Click '+ New query' button")
    print("2. Copy the entire content of: complete_schema.sql")
    print("3. Paste it into the SQL editor")
    print("4. Click 'Run' button (or press Ctrl+Enter)")
    print("5. Wait for all statements to execute successfully")
    print()
    
    print("✅ STEP 3: Verify Setup")
    print("=" * 30)
    print("1. Go to 'Table Editor' in the left sidebar")
    print("2. You should see these tables:")
    print("   - users (with 3 sample users)")
    print("   - listings (with 3 sample listings)")
    print("   - favorites")
    print("   - conversations")
    print("   - messages")
    print("   - contact_history")
    print("   - news (with 3 sample articles)")
    print("   - view_history")
    print()
    
    print("🔧 STEP 4: Test Your App")
    print("=" * 30)
    print("After running the SQL schema:")
    print("1. Run: python3 test_final_setup.py")
    print("2. If successful, run: npm run start-web")
    print("3. Open your browser and test the app")
    print()
    
    print("📱 STEP 5: Sample Data")
    print("=" * 30)
    print("The schema includes sample accounts:")
    print("- Broker: broker@vungtauland.com")
    print("- User: user@vungtauland.com")
    print("- Admin: admin@vungtauland.com")
    print("- 3 sample listings with images")
    print("- 3 sample news articles")
    print()
    
    print("🚨 IMPORTANT NOTES:")
    print("=" * 30)
    print("- Make sure to run the COMPLETE content of complete_schema.sql")
    print("- Don't run it in parts - run everything at once")
    print("- If you get any errors, check the error messages carefully")
    print("- The script uses 'IF NOT EXISTS' so it's safe to run multiple times")
    print()
    
    print("🆘 TROUBLESHOOTING:")
    print("=" * 30)
    print("If you encounter issues:")
    print("1. Check if all environment variables are set correctly")
    print("2. Verify your Supabase project is active")
    print("3. Make sure you have the correct permissions")
    print("4. Try running smaller parts of the SQL if needed")
    print()
    
    print("🎯 Your Project Details:")
    print("=" * 30)
    print(f"Project URL: {supabase_url}")
    print(f"Project Ref: {project_ref}")
    print(f"Dashboard: https://app.supabase.com/project/{project_ref}")
    print()
    
    print("💡 Ready to go? Run the SQL file and then test with:")
    print("   python3 test_final_setup.py")

if __name__ == "__main__":
    print_setup_instructions()