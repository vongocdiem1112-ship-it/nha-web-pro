# VungTauLand Backend Setup Instructions

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: VungTauLand
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 2. Get Your Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Setup Database

Run these SQL scripts in order in your Supabase SQL Editor:

1. **Create Tables & Indexes**
   - Go to Supabase Dashboard > SQL Editor
   - Click "New Query"
   - Copy and paste contents of `supabase/schema.sql`
   - Click "Run"

2. **Setup RLS Policies**
   - New Query
   - Copy and paste contents of `supabase/rls-policies.sql`
   - Click "Run"

3. **Create Functions & Triggers**
   - New Query
   - Copy and paste contents of `supabase/functions.sql`
   - Click "Run"

4. **Add Sample Data** (Optional)
   - New Query
   - Copy and paste contents of `supabase/seed.sql`
   - Click "Run"

### 5. Setup Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create these buckets (click "New bucket"):

   **Bucket 1: listing-images**
   - Name: `listing-images`
   - Public: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Bucket 2: avatars**
   - Name: `avatars`
   - Public: ✅ Yes
   - File size limit: 2 MB
   - Allowed MIME types: `image/jpeg, image/png`

   **Bucket 3: news-images**
   - Name: `news-images`
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

3. After creating buckets, run storage policies:
   - Go to SQL Editor
   - New Query
   - Copy and paste contents of `supabase/storage.sql`
   - Click "Run"

### 6. Enable Authentication

1. Go to **Authentication** > **Providers** in Supabase Dashboard
2. Enable **Email** provider (should be enabled by default)
3. (Optional) Configure email templates in Vietnamese:
   - Go to **Authentication** > **Email Templates**
   - Customize confirmation, reset password emails

### 7. Start Your App

```bash
bun start
```

Your app is now connected to Supabase backend! 🎉

---

## 📊 Database Schema Overview

### Tables Created:
- ✅ **users** - User accounts (user, broker, admin roles)
- ✅ **listings** - Property listings
- ✅ **favorites** - Saved listings
- ✅ **conversations** - Chat conversations
- ✅ **messages** - Chat messages
- ✅ **contact_history** - Contact tracking
- ✅ **news** - Real estate news
- ✅ **view_history** - User view history

### Features:
- ✅ Row Level Security (RLS) on all tables
- ✅ Automatic timestamp updates
- ✅ Optimized indexes
- ✅ Database functions for complex queries
- ✅ Triggers for auto-updates
- ✅ Storage buckets with policies

---

## 🧪 Testing Your Setup

### Test 1: View Listings (No Auth Required)
Open the app and browse listings on the home screen.

### Test 2: Register Account
1. Go to Profile tab
2. Click "Đăng nhập / Đăng ký"
3. Register with email and password
4. Check if account is created

### Test 3: Add to Favorites (Auth Required)
1. Login
2. Browse listings
3. Tap heart icon on a listing
4. Go to Favorites tab to see saved listings

### Test 4: Create Listing (Broker Only)
1. Register as broker
2. Wait for approval (or manually approve in Supabase)
3. Go to "Đăng tin" tab
4. Fill form and submit

### Test 5: Chat (Auth Required)
1. Login
2. View a listing
3. Tap "Nhắn tin" button
4. Send a message

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch listings"
- ✅ Check if `.env.local` has correct Supabase URL and key
- ✅ Verify `schema.sql` was run successfully
- ✅ Check RLS policies are enabled

### Issue: "Unauthorized" errors
- ✅ Make sure user is logged in
- ✅ Check if RLS policies allow the operation
- ✅ Verify user role and broker_status

### Issue: "Failed to upload image"
- ✅ Check if storage buckets are created
- ✅ Verify bucket is set to public
- ✅ Run `storage.sql` to apply policies

### Issue: Can't create listing as broker
- ✅ Check if user role is 'broker'
- ✅ Verify broker_status is 'approved'
- ✅ Manually approve in Supabase: `users` table → find user → set `broker_status` to 'approved'

---

## 📚 API Endpoints (tRPC)

All endpoints are available via tRPC at `/api/trpc/*`

### Listings
- `listings.getAll` - Get all listings
- `listings.getById` - Get listing by ID
- `listings.search` - Search with filters
- `listings.create` - Create listing (broker only)
- `listings.update` - Update listing (owner only)
- `listings.delete` - Delete listing (owner only)
- `listings.getMyListings` - Get my listings (auth required)

### Auth
- `auth.register` - Register new user
- `auth.login` - Login user

### Users
- `users.getProfile` - Get user profile (auth required)
- `users.updateProfile` - Update profile (auth required)

### Favorites
- `favorites.getAll` - Get all favorites (auth required)
- `favorites.add` - Add to favorites (auth required)
- `favorites.remove` - Remove from favorites (auth required)
- `favorites.check` - Check if listing is favorited (auth required)

### News
- `news.getAll` - Get all news
- `news.getById` - Get news by ID

### Chat
- `conversations.getAll` - Get all conversations (auth required)
- `conversations.getOrCreate` - Get or create conversation (auth required)
- `messages.getByConversation` - Get messages (auth required)
- `messages.send` - Send message (auth required)

### Contact History
- `contactHistory.create` - Create contact record
- `contactHistory.getBrokerHistory` - Get broker's contact history (broker only)

### Broker
- `broker.getStatistics` - Get broker statistics (broker only)

---

## 🎯 Next Steps

1. ✅ Test all features in the app
2. ✅ Customize email templates in Vietnamese
3. ✅ Add more sample data if needed
4. ✅ Configure production environment variables
5. ✅ Setup monitoring and error tracking

---

## 📞 Support

If you encounter any issues:
1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors
3. Verify all SQL scripts ran successfully
4. Review RLS policies in Supabase Dashboard

---

**Your VungTauLand app is now fully connected to Supabase! 🚀**
