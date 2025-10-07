import { supabase } from './lib/supabase';

export async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log(`📊 Found ${data?.length || 0} users in database`);
    
    // Test auth
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Auth session status:', session ? 'Active' : 'No session');
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

// Run test on import (for development)
if (__DEV__) {
  testSupabaseConnection();
}