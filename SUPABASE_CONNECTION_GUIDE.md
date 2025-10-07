# 🎯 VungTauLand Supabase Connection Methods

## ✅ PREFERRED METHOD - Direct PostgreSQL

**Connection String**: 
```
postgresql://postgres.zewyoonmkknfbgrmsfhw:Acookingoil123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Advantages**:
- ✅ Direct database access
- ✅ Full SQL support (CREATE, ALTER, DROP)
- ✅ Fastest performance
- ✅ No API limitations
- ✅ Can create schemas, indexes, triggers

**Usage**:
```python
import psycopg2
conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL"))
cursor = conn.cursor()
cursor.execute("CREATE TABLE ...")
```

## 🔄 FALLBACK METHOD - Supabase Client

**For data operations only** (SELECT, INSERT, UPDATE, DELETE)

```python
from supabase import create_client
supabase = create_client(url, service_key)
result = supabase.table("users").insert(data).execute()
```

## 🚀 Smart Connection Manager

**File**: `smart_supabase.py`

Automatically chooses the best method:
1. **PostgreSQL Direct** (for schema operations)
2. **Supabase Client** (for data operations)
3. **Fallback handling** (if one method fails)

## 📋 Quick Commands

```bash
# Test all connections
npm run test-db

# Setup complete database
npm run setup-db

# Start the app
npm run start-web
```

## 🔧 Environment Variables

```env
# Client connections
EXPO_PUBLIC_SUPABASE_URL=https://zewyoonmkknfbgrmsfhw.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Admin connections  
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_DB_URL=postgresql://postgres.zewyoonmkknfbgrmsfw:Acookingoil123@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres

# Project info
SUPABASE_PROJECT_REF=zewyoonmkknfbgrmsfhw
```

## 🎯 When to Use Which Method

### Use PostgreSQL Direct for:
- Creating tables, indexes, functions
- Running complex SQL
- Schema migrations
- Performance optimization
- Bulk operations

### Use Supabase Client for:
- CRUD operations in apps
- Real-time subscriptions
- File uploads
- Auth operations
- RLS policy testing

## 🏆 Best Practices

1. **Always try PostgreSQL first** for schema operations
2. **Use Supabase Client** for app data operations  
3. **Smart Manager handles fallbacks** automatically
4. **Keep credentials secure** in `.env`
5. **Test connections before operations**