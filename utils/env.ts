export const env = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  api: {
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10),
    maxUploadSize: parseInt(process.env.EXPO_PUBLIC_MAX_UPLOAD_SIZE || '10485760', 10),
  },
  features: {
    analytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    pushNotifications: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },
  app: {
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    minSupportedVersion: process.env.EXPO_PUBLIC_MIN_SUPPORTED_VERSION || '1.0.0',
  },
} as const;

export const isDev = __DEV__;
export const isProd = !__DEV__;
