import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ✅ VungTauLand Supabase Configuration (Updated & Verified)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zewyoonmkknfbgrmsfhw.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpld3lvb25ta2tuZmJncm1zZmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjI3NDgsImV4cCI6MjA3NTAzODc0OH0.xMHzfexKR-x6-x47pPAX5gMj395jMKS7hQUPPeBLKLU';

// Cross-platform storage
const webStorage = {
  getItem: async (key: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  },
};

const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;

// Main Supabase client (for app usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ✅ Connection Status & Testing
let connectionTested = false;

export const testSupabaseConnection = async () => {
  if (connectionTested) return true;
  
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully!');
    console.log(`📊 Database ready with ${data?.length || 0} users`);
    connectionTested = true;
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};

// Auto-test connection in development
if (__DEV__) {
  testSupabaseConnection();
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string;
          avatar_url: string | null;
          role: 'user' | 'broker' | 'admin';
          broker_status: 'pending' | 'approved' | 'rejected' | null;
          social_links: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          type: 'nha' | 'dat' | 'chung_cu' | 'cho_thue';
          title: string;
          description: string | null;
          price: number;
          area: number;
          bedrooms: number | null;
          bathrooms: number | null;
          direction: string | null;
          address: string;
          district: string;
          city: string;
          latitude: number | null;
          longitude: number | null;
          images: string[];
          is_hot: boolean;
          status: 'active' | 'hidden' | 'sold' | 'rented';
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['listings']['Row'], 'id' | 'created_at' | 'updated_at' | 'views_count'>;
        Update: Partial<Database['public']['Tables']['listings']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string;
          broker_id: string;
          last_message: string | null;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'last_message' | 'last_message_at'>;
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          image_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'is_read'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      contact_history: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string | null;
          broker_id: string;
          contact_type: 'call' | 'chat' | 'view';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_history']['Insert']>;
      };
      news: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          image_url: string | null;
          category: 'thi_truong' | 'phan_tich' | 'du_an';
          views_count: number;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at' | 'updated_at' | 'views_count'>;
        Update: Partial<Database['public']['Tables']['news']['Insert']>;
      };
      view_history: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['view_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['view_history']['Insert']>;
      };
    };
  };
};
