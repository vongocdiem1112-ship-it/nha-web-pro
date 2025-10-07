#!/bin/bash

# VungTauLand Database Setup Script
# This script will create the database schema in your Supabase project

echo "🏗️  Setting up VungTauLand Database Schema..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Database setup instructions:${NC}"
echo ""
echo "1. Go to your Supabase dashboard: https://app.supabase.com"
echo "2. Open your project: https://app.supabase.com/project/zewyoonmkknfbgrmsfhw"
echo "3. Navigate to SQL Editor"
echo "4. Create a new query and paste the contents of:"
echo "   - supabase/schema.sql (for table structure)"
echo "   - supabase/rls-policies.sql (for security policies)"
echo "   - supabase/functions.sql (for database functions)"
echo "   - supabase/storage.sql (for file storage setup)"
echo "   - supabase/seed.sql (for sample data)"
echo ""
echo -e "${GREEN}✅ Files are ready in the supabase/ directory${NC}"
echo ""
echo -e "${YELLOW}🔧 After setting up the database:${NC}"
echo "1. Run: bun install"
echo "2. Run: bun run start-web"
echo "3. Test the connection in the app"
echo ""
echo -e "${GREEN}🚀 Your Supabase URL: https://zewyoonmkknfbgrmsfhw.supabase.co${NC}"