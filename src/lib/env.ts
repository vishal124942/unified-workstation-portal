
/**
 * Environment variables helper with proper types
 */
interface EnvVariables {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

// Default placeholder values for development
const defaultValues: EnvVariables = {
  VITE_SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'example-anon-key'
};

// Get environment variable with fallback to default
export function getEnv(key: keyof EnvVariables): string {
  const value = import.meta.env[key];
  if (value) return value as string;
  
  console.warn(`Environment variable ${key} is missing. Using default placeholder value.`);
  return defaultValues[key];
}
