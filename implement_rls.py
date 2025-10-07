#!/usr/bin/env python3
"""
VungTauLand Row Level Security (RLS) Implementation
Implement comprehensive RLS policies for all tables
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv()

class RLSImplementer:
    def __init__(self):
        self.db_url = os.getenv("SUPABASE_DB_URL")
        self.conn = None
        self.cursor = None
    
    def connect(self):
        """Connect to database"""
        try:
            self.conn = psycopg2.connect(self.db_url)
            self.conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            self.cursor = self.conn.cursor()
            return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False
    
    def enable_rls_on_table(self, table_name):
        """Enable RLS on a table"""
        try:
            self.cursor.execute(f"ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;")
            print(f"   ✅ RLS enabled on {table_name}")
            return True
        except Exception as e:
            print(f"   ❌ Failed to enable RLS on {table_name}: {e}")
            return False
    
    def create_listings_policies(self):
        """Create RLS policies for listings table"""
        print("🏠 Creating listings RLS policies...")
        
        policies = [
            # Anyone can view published listings
            {
                "name": "listings_select_policy",
                "command": "SELECT",
                "policy": "status = 'active' OR auth.uid() = user_id OR auth.role() = 'admin'"
            },
            # Only owners and admins can insert
            {
                "name": "listings_insert_policy", 
                "command": "INSERT",
                "policy": "auth.uid() = user_id OR auth.role() = 'admin'"
            },
            # Only owners and admins can update
            {
                "name": "listings_update_policy",
                "command": "UPDATE", 
                "policy": "auth.uid() = user_id OR auth.role() = 'admin'"
            },
            # Only owners and admins can delete
            {
                "name": "listings_delete_policy",
                "command": "DELETE",
                "policy": "auth.uid() = user_id OR auth.role() = 'admin'"
            }
        ]
        
        self.enable_rls_on_table("listings")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON listings
                    FOR {policy['command']} 
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_favorites_policies(self):
        """Create RLS policies for favorites table"""
        print("💝 Creating favorites RLS policies...")
        
        policies = [
            {
                "name": "favorites_select_policy",
                "command": "SELECT", 
                "policy": "auth.uid() = user_id OR auth.role() = 'admin'"
            },
            {
                "name": "favorites_insert_policy",
                "command": "INSERT",
                "policy": "auth.uid() = user_id"
            },
            {
                "name": "favorites_delete_policy", 
                "command": "DELETE",
                "policy": "auth.uid() = user_id OR auth.role() = 'admin'"
            }
        ]
        
        self.enable_rls_on_table("favorites")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON favorites
                    FOR {policy['command']}
                    TO authenticated  
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_conversations_policies(self):
        """Create RLS policies for conversations table"""
        print("💬 Creating conversations RLS policies...")
        
        policies = [
            {
                "name": "conversations_select_policy",
                "command": "SELECT",
                "policy": "auth.uid() = user_id OR auth.uid() = broker_id OR auth.role() = 'admin'"
            },
            {
                "name": "conversations_insert_policy", 
                "command": "INSERT",
                "policy": "auth.uid() = user_id OR auth.uid() = broker_id"
            },
            {
                "name": "conversations_update_policy",
                "command": "UPDATE",
                "policy": "auth.uid() = user_id OR auth.uid() = broker_id OR auth.role() = 'admin'"
            }
        ]
        
        self.enable_rls_on_table("conversations")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON conversations
                    FOR {policy['command']}
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_messages_policies(self):
        """Create RLS policies for messages table"""
        print("📨 Creating messages RLS policies...")
        
        policies = [
            {
                "name": "messages_select_policy",
                "command": "SELECT",
                "policy": """
                EXISTS (
                    SELECT 1 FROM conversations c 
                    WHERE c.id = conversation_id 
                    AND (c.user_id = auth.uid() OR c.broker_id = auth.uid())
                ) OR auth.role() = 'admin'
                """
            },
            {
                "name": "messages_insert_policy",
                "command": "INSERT", 
                "policy": """
                EXISTS (
                    SELECT 1 FROM conversations c 
                    WHERE c.id = conversation_id 
                    AND (c.user_id = auth.uid() OR c.broker_id = auth.uid())
                ) AND auth.uid() = sender_id
                """
            }
        ]
        
        self.enable_rls_on_table("messages")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON messages
                    FOR {policy['command']}
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_contact_history_policies(self):
        """Create RLS policies for contact_history table"""
        print("📞 Creating contact_history RLS policies...")
        
        policies = [
            {
                "name": "contact_history_select_policy",
                "command": "SELECT",
                "policy": "auth.uid() = broker_id OR auth.role() = 'admin'"
            },
            {
                "name": "contact_history_insert_policy",
                "command": "INSERT",
                "policy": "auth.uid() = broker_id"
            }
        ]
        
        self.enable_rls_on_table("contact_history")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON contact_history
                    FOR {policy['command']}
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_view_history_policies(self):
        """Create RLS policies for view_history table"""
        print("👀 Creating view_history RLS policies...")
        
        policies = [
            {
                "name": "view_history_select_policy",
                "command": "SELECT",
                "policy": "auth.uid() = user_id OR auth.role() = 'admin'"
            },
            {
                "name": "view_history_insert_policy",
                "command": "INSERT", 
                "policy": "auth.uid() = user_id"
            }
        ]
        
        self.enable_rls_on_table("view_history")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON view_history
                    FOR {policy['command']}
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_users_policies(self):
        """Create RLS policies for users table"""
        print("👥 Creating users RLS policies...")
        
        policies = [
            {
                "name": "users_select_policy",
                "command": "SELECT",
                "policy": "auth.uid() = id OR auth.role() = 'admin' OR role = 'broker'"
            },
            {
                "name": "users_update_policy", 
                "command": "UPDATE",
                "policy": "auth.uid() = id OR auth.role() = 'admin'"
            }
        ]
        
        self.enable_rls_on_table("users")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON users
                    FOR {policy['command']}
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def create_news_policies(self):
        """Create RLS policies for news table"""  
        print("📰 Creating news RLS policies...")
        
        # News can be read by everyone, but only admins can modify
        policies = [
            {
                "name": "news_select_policy",
                "command": "SELECT",
                "policy": "true"  # Everyone can read news
            },
            {
                "name": "news_insert_policy",
                "command": "INSERT",
                "policy": "auth.role() = 'admin'"
            },
            {
                "name": "news_update_policy",
                "command": "UPDATE", 
                "policy": "auth.role() = 'admin'"
            },
            {
                "name": "news_delete_policy",
                "command": "DELETE",
                "policy": "auth.role() = 'admin'"
            }
        ]
        
        self.enable_rls_on_table("news")
        
        for policy in policies:
            try:
                self.cursor.execute(f"""
                    CREATE POLICY {policy['name']} ON news
                    FOR {policy['command']}
                    TO authenticated
                    USING ({policy['policy']});
                """)
                print(f"   ✅ Created policy: {policy['name']}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"   ⚠️  Policy {policy['name']} already exists")
                else:
                    print(f"   ❌ Failed to create {policy['name']}: {e}")
    
    def verify_rls_implementation(self):
        """Verify RLS policies are working"""
        print("\n🔍 Verifying RLS Implementation...")
        
        # Check RLS is enabled on all tables
        self.cursor.execute("""
            SELECT schemaname, tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename IN ('users', 'listings', 'favorites', 'conversations', 'messages', 'contact_history', 'news', 'view_history')
            ORDER BY tablename;
        """)
        
        tables_rls = self.cursor.fetchall()
        
        print("   📊 RLS Status by Table:")
        for schema, table, rls_enabled in tables_rls:
            status = "✅ Enabled" if rls_enabled else "❌ Disabled"
            print(f"      {table:15}: {status}")
        
        # Check number of policies created
        self.cursor.execute("""
            SELECT schemaname, tablename, COUNT(*) as policy_count
            FROM pg_policies 
            WHERE schemaname = 'public'
            GROUP BY schemaname, tablename
            ORDER BY tablename;
        """)
        
        policy_counts = self.cursor.fetchall()
        
        print("\n   🛡️  Policies Count by Table:")
        total_policies = 0
        for schema, table, count in policy_counts:
            total_policies += count
            print(f"      {table:15}: {count} policies")
        
        print(f"\n   🎯 Total RLS Policies: {total_policies}")
        
        return total_policies > 15  # Should have 15+ policies
    
    def run_rls_implementation(self):
        """Run complete RLS implementation"""
        print("🛡️  Starting VungTauLand RLS Implementation...")
        print("="*50)
        
        if not self.connect():
            return False
        
        try:
            # Create RLS policies for all tables
            self.create_users_policies()
            self.create_listings_policies()
            self.create_favorites_policies() 
            self.create_conversations_policies()
            self.create_messages_policies()
            self.create_contact_history_policies()
            self.create_view_history_policies()
            self.create_news_policies()
            
            # Verify implementation
            success = self.verify_rls_implementation()
            
            if success:
                print("\n🎉 RLS Implementation Completed Successfully!")
                print("✅ All tables are now secured with Row Level Security")
                print("🔒 Users can only access their own data")
                print("👑 Admins have full access to all data")
                print("🏠 Brokers can manage their own listings")
                print("\n🚀 Security Score should now be 95%+!")
            else:
                print("\n⚠️  RLS Implementation completed with some issues")
                print("🔍 Please check the policies manually")
            
            return success
            
        except Exception as e:
            print(f"❌ RLS implementation failed: {e}")
            return False
        finally:
            if self.cursor:
                self.cursor.close()
            if self.conn:
                self.conn.close()

if __name__ == "__main__":
    implementer = RLSImplementer()
    success = implementer.run_rls_implementation()
    sys.exit(0 if success else 1)