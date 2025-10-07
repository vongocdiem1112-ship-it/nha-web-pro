#!/usr/bin/env python3
"""
VungTauLand Database Audit Script
Comprehensive audit of database schema, data, relationships, and performance
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

class DatabaseAuditor:
    def __init__(self):
        self.db_url = os.getenv("SUPABASE_DB_URL")
        self.conn = None
        self.cursor = None
        self.audit_results = {
            "timestamp": datetime.now().isoformat(),
            "schema_audit": {},
            "data_audit": {},
            "relationship_audit": {},
            "performance_audit": {},
            "security_audit": {},
            "overall_score": 0
        }
    
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
    
    def audit_schema(self):
        """Audit database schema completeness"""
        print("🔍 Auditing Database Schema...")
        
        schema_results = {
            "tables": {},
            "indexes": {},
            "constraints": {},
            "functions": {},
            "types": {},
            "score": 0
        }
        
        # Expected tables and their key columns
        expected_tables = {
            "users": ["id", "email", "full_name", "role", "created_at"],
            "listings": ["id", "user_id", "type", "title", "price", "area", "district"],
            "favorites": ["id", "user_id", "listing_id"],
            "conversations": ["id", "listing_id", "user_id", "broker_id"],
            "messages": ["id", "conversation_id", "sender_id", "content"],
            "contact_history": ["id", "listing_id", "broker_id", "contact_type"],
            "news": ["id", "title", "content", "category"],
            "view_history": ["id", "user_id", "listing_id"]
        }
        
        # Check tables
        self.cursor.execute("""
            SELECT table_name, column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        """)
        
        db_tables = {}
        for row in self.cursor.fetchall():
            table, column, data_type, nullable = row
            if table not in db_tables:
                db_tables[table] = []
            db_tables[table].append({
                "column": column,
                "type": data_type,
                "nullable": nullable
            })
        
        table_score = 0
        for table, expected_cols in expected_tables.items():
            if table in db_tables:
                actual_cols = [col["column"] for col in db_tables[table]]
                missing_cols = set(expected_cols) - set(actual_cols)
                extra_cols = set(actual_cols) - set(expected_cols)
                
                score = max(0, 100 - len(missing_cols) * 20 - len(extra_cols) * 5)
                schema_results["tables"][table] = {
                    "exists": True,
                    "columns": len(actual_cols),
                    "missing_columns": list(missing_cols),
                    "extra_columns": list(extra_cols),
                    "score": score
                }
                table_score += score
                print(f"  ✅ {table}: {score}/100 ({len(actual_cols)} columns)")
                
                if missing_cols:
                    print(f"      ⚠️  Missing: {', '.join(missing_cols)}")
            else:
                schema_results["tables"][table] = {
                    "exists": False,
                    "score": 0
                }
                print(f"  ❌ {table}: MISSING")
        
        # Check indexes
        self.cursor.execute("""
            SELECT indexname, tablename, indexdef 
            FROM pg_indexes 
            WHERE schemaname = 'public'
            AND indexname NOT LIKE '%_pkey';
        """)
        
        indexes = self.cursor.fetchall()
        schema_results["indexes"] = {
            "count": len(indexes),
            "details": [{"name": idx[0], "table": idx[1]} for idx in indexes]
        }
        
        index_score = min(100, len(indexes) * 10)  # 10 points per index, max 100
        print(f"  📊 Indexes: {len(indexes)} found ({index_score}/100)")
        
        # Check foreign key constraints
        self.cursor.execute("""
            SELECT tc.table_name, tc.constraint_name, kcu.column_name,
                   ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY';
        """)
        
        foreign_keys = self.cursor.fetchall()
        schema_results["constraints"]["foreign_keys"] = len(foreign_keys)
        constraint_score = min(100, len(foreign_keys) * 15)  # 15 points per FK
        print(f"  🔗 Foreign Keys: {len(foreign_keys)} found ({constraint_score}/100)")
        
        # Check custom types (enums)
        self.cursor.execute("""
            SELECT typname FROM pg_type 
            WHERE typtype = 'e' AND typname LIKE '%_type' OR typname LIKE '%_status' OR typname LIKE '%_role';
        """)
        
        custom_types = self.cursor.fetchall()
        schema_results["types"] = {
            "count": len(custom_types),
            "names": [t[0] for t in custom_types]
        }
        
        type_score = min(100, len(custom_types) * 20)  # 20 points per custom type
        print(f"  🏷️  Custom Types: {len(custom_types)} found ({type_score}/100)")
        
        schema_results["score"] = (table_score / len(expected_tables) + index_score + constraint_score + type_score) / 4
        self.audit_results["schema_audit"] = schema_results
        
        print(f"  🎯 Schema Score: {schema_results['score']:.1f}/100\n")
    
    def audit_data_quality(self):
        """Audit data quality and completeness"""
        print("📊 Auditing Data Quality...")
        
        data_results = {
            "table_counts": {},
            "data_quality": {},
            "referential_integrity": {},
            "score": 0
        }
        
        # Get record counts
        tables = ["users", "listings", "favorites", "conversations", "messages", "contact_history", "news", "view_history"]
        total_records = 0
        
        for table in tables:
            try:
                self.cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = self.cursor.fetchone()[0]
                data_results["table_counts"][table] = count
                total_records += count
                print(f"  📋 {table:15}: {count:4} records")
            except Exception as e:
                data_results["table_counts"][table] = -1
                print(f"  ❌ {table:15}: ERROR")
        
        # Check data quality for key tables
        quality_checks = []
        
        # Users quality
        if data_results["table_counts"]["users"] > 0:
            self.cursor.execute("SELECT COUNT(*) FROM users WHERE email IS NULL OR email = '';")
            invalid_emails = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM users WHERE full_name IS NULL OR full_name = '';")
            invalid_names = self.cursor.fetchone()[0]
            
            user_quality = max(0, 100 - (invalid_emails + invalid_names) * 20)
            quality_checks.append(user_quality)
            print(f"    👥 Users data quality: {user_quality}/100")
        
        # Listings quality
        if data_results["table_counts"]["listings"] > 0:
            self.cursor.execute("SELECT COUNT(*) FROM listings WHERE title IS NULL OR title = '';")
            invalid_titles = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM listings WHERE price <= 0;")
            invalid_prices = self.cursor.fetchone()[0]
            
            self.cursor.execute("SELECT COUNT(*) FROM listings WHERE area <= 0;")
            invalid_areas = self.cursor.fetchone()[0]
            
            listing_quality = max(0, 100 - (invalid_titles + invalid_prices + invalid_areas) * 10)
            quality_checks.append(listing_quality)
            print(f"    🏠 Listings data quality: {listing_quality}/100")
        
        # Check referential integrity
        integrity_score = 100
        
        # Check orphaned records
        try:
            self.cursor.execute("""
                SELECT COUNT(*) FROM listings l 
                LEFT JOIN users u ON l.user_id = u.id 
                WHERE u.id IS NULL;
            """)
            orphaned_listings = self.cursor.fetchone()[0]
            if orphaned_listings > 0:
                integrity_score -= orphaned_listings * 10
                print(f"    ⚠️  Orphaned listings: {orphaned_listings}")
        except:
            pass
        
        data_results["referential_integrity"]["score"] = max(0, integrity_score)
        data_results["data_quality"]["average"] = sum(quality_checks) / len(quality_checks) if quality_checks else 0
        
        # Overall data score
        count_score = min(100, total_records * 2)  # 2 points per record, max 100
        data_results["score"] = (count_score + data_results["data_quality"]["average"] + integrity_score) / 3
        
        self.audit_results["data_audit"] = data_results
        print(f"  🎯 Data Score: {data_results['score']:.1f}/100\n")
    
    def audit_performance(self):
        """Audit database performance"""
        print("⚡ Auditing Performance...")
        
        perf_results = {
            "query_performance": {},
            "index_usage": {},
            "table_sizes": {},
            "score": 0
        }
        
        # Test query performance
        import time
        
        # Test simple queries
        queries = [
            ("SELECT COUNT(*) FROM users", "users_count"),
            ("SELECT COUNT(*) FROM listings", "listings_count"),
            ("SELECT * FROM listings WHERE type = 'nha' LIMIT 10", "listings_filter"),
            ("SELECT l.*, u.full_name FROM listings l JOIN users u ON l.user_id = u.id LIMIT 10", "listings_join")
        ]
        
        total_time = 0
        for query, name in queries:
            try:
                start_time = time.time()
                self.cursor.execute(query)
                self.cursor.fetchall()
                end_time = time.time()
                
                query_time = (end_time - start_time) * 1000  # ms
                total_time += query_time
                perf_results["query_performance"][name] = {
                    "time_ms": round(query_time, 2),
                    "status": "fast" if query_time < 100 else "slow" if query_time < 1000 else "very_slow"
                }
                print(f"  ⏱️  {name}: {query_time:.2f}ms")
            except Exception as e:
                perf_results["query_performance"][name] = {"error": str(e)}
        
        # Performance score based on query times
        avg_time = total_time / len(queries)
        perf_score = max(0, 100 - avg_time)  # Subtract 1 point per ms over baseline
        
        perf_results["score"] = perf_score
        self.audit_results["performance_audit"] = perf_results
        print(f"  🎯 Performance Score: {perf_score:.1f}/100\n")
    
    def audit_security(self):
        """Audit security aspects"""
        print("🔒 Auditing Security...")
        
        security_results = {
            "rls_policies": {},
            "user_roles": {},
            "sensitive_data": {},
            "score": 0
        }
        
        # Check RLS policies (this might not work with current connection)
        try:
            self.cursor.execute("""
                SELECT schemaname, tablename, policyname, cmd, qual
                FROM pg_policies
                WHERE schemaname = 'public';
            """)
            policies = self.cursor.fetchall()
            security_results["rls_policies"]["count"] = len(policies)
            print(f"  🛡️  RLS Policies: {len(policies)} found")
        except:
            security_results["rls_policies"]["count"] = 0
            print(f"  ⚠️  RLS Policies: Unable to check")
        
        # Check user role distribution
        try:
            self.cursor.execute("SELECT role, COUNT(*) FROM users GROUP BY role;")
            roles = dict(self.cursor.fetchall())
            security_results["user_roles"] = roles
            print(f"  👥 User Roles: {roles}")
        except:
            pass
        
        # Basic security score
        security_score = 70  # Base score
        if security_results["rls_policies"]["count"] > 0:
            security_score += 30
        
        security_results["score"] = security_score
        self.audit_results["security_audit"] = security_results
        print(f"  🎯 Security Score: {security_score}/100\n")
    
    def generate_audit_report(self):
        """Generate comprehensive audit report"""
        print("📋 Generating Audit Report...")
        
        # Calculate overall score
        scores = [
            self.audit_results["schema_audit"]["score"],
            self.audit_results["data_audit"]["score"],
            self.audit_results["performance_audit"]["score"],
            self.audit_results["security_audit"]["score"]
        ]
        
        overall_score = sum(scores) / len(scores)
        self.audit_results["overall_score"] = overall_score
        
        # Generate report
        print("\n" + "="*60)
        print("🎯 VUNGTAULAND DATABASE AUDIT REPORT")
        print("="*60)
        print(f"📅 Audit Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🗄️  Database: VungTauLand Real Estate")
        print(f"🔗 Connection: PostgreSQL Direct")
        print()
        
        print("📊 AUDIT SCORES:")
        print(f"  🗂️  Schema Completeness : {self.audit_results['schema_audit']['score']:6.1f}/100")
        print(f"  📋 Data Quality       : {self.audit_results['data_audit']['score']:6.1f}/100")
        print(f"  ⚡ Performance        : {self.audit_results['performance_audit']['score']:6.1f}/100")
        print(f"  🔒 Security           : {self.audit_results['security_audit']['score']:6.1f}/100")
        print(f"  {'─'*25}")
        print(f"  🎯 OVERALL SCORE      : {overall_score:6.1f}/100")
        print()
        
        # Grade
        if overall_score >= 90:
            grade = "A+ 🌟"
            status = "EXCELLENT - Production Ready"
        elif overall_score >= 80:
            grade = "A  ✅"
            status = "VERY GOOD - Minor improvements needed"
        elif overall_score >= 70:
            grade = "B+ ⚠️"
            status = "GOOD - Some improvements needed"
        elif overall_score >= 60:
            grade = "B  🔧"
            status = "FAIR - Significant improvements needed"
        else:
            grade = "C  ❌"
            status = "POOR - Major fixes required"
        
        print(f"📈 GRADE: {grade}")
        print(f"🏷️  STATUS: {status}")
        print()
        
        # Detailed findings
        print("🔍 DETAILED FINDINGS:")
        
        # Schema findings
        schema_audit = self.audit_results["schema_audit"]
        print(f"\n📂 Schema Analysis:")
        print(f"   Tables: {len(schema_audit['tables'])} defined")
        print(f"   Indexes: {schema_audit['indexes']['count']} performance indexes")
        print(f"   Foreign Keys: {schema_audit['constraints']['foreign_keys']} relationships")
        print(f"   Custom Types: {schema_audit['types']['count']} enums")
        
        # Data findings
        data_audit = self.audit_results["data_audit"]
        total_records = sum(count for count in data_audit["table_counts"].values() if count > 0)
        print(f"\n📈 Data Analysis:")
        print(f"   Total Records: {total_records}")
        print(f"   Tables with Data: {sum(1 for count in data_audit['table_counts'].values() if count > 0)}/8")
        print(f"   Data Quality: {data_audit['data_quality'].get('average', 0):.1f}%")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        
        if overall_score < 90:
            if self.audit_results["schema_audit"]["score"] < 90:
                print("   🔧 Add missing indexes for better performance")
                print("   🔧 Implement Row Level Security (RLS) policies")
            
            if self.audit_results["data_audit"]["score"] < 90:
                print("   📊 Add more sample data for testing")
                print("   🔍 Implement data validation constraints")
            
            if self.audit_results["performance_audit"]["score"] < 90:
                print("   ⚡ Optimize slow queries")
                print("   📊 Add database connection pooling")
            
            if self.audit_results["security_audit"]["score"] < 90:
                print("   🔒 Implement RLS policies for all tables")
                print("   🛡️  Add authentication middleware")
        else:
            print("   🎉 Database is in excellent condition!")
            print("   🚀 Ready for production deployment")
        
        print("\n" + "="*60)
        
        return overall_score >= 80  # Return True if passing grade
    
    def run_full_audit(self):
        """Run comprehensive database audit"""
        print("🔍 Starting VungTauLand Database Audit...")
        print("="*50)
        
        if not self.connect():
            return False
        
        try:
            self.audit_schema()
            self.audit_data_quality()
            self.audit_performance()
            self.audit_security()
            
            success = self.generate_audit_report()
            
            # Save audit results to file
            with open('database_audit_report.json', 'w') as f:
                json.dump(self.audit_results, f, indent=2)
            
            print(f"\n💾 Detailed audit saved to: database_audit_report.json")
            
            return success
            
        except Exception as e:
            print(f"❌ Audit failed: {e}")
            return False
        finally:
            if self.cursor:
                self.cursor.close()
            if self.conn:
                self.conn.close()

if __name__ == "__main__":
    auditor = DatabaseAuditor()
    success = auditor.run_full_audit()
    sys.exit(0 if success else 1)