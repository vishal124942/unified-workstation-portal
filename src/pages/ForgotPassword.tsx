
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { SupabaseSetup } from "@/components/setup/SupabaseSetup";
import { useEffect, useState } from "react";
import { getEnv } from "@/lib/env";

export default function ForgotPassword() {
  const [showSetup, setShowSetup] = useState(false);
  
  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = getEnv('VITE_SUPABASE_URL');
    const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');
    
    if (supabaseUrl.includes('example') || supabaseKey.includes('example')) {
      setShowSetup(true);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {showSetup ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">
              Supabase Configuration Required
            </h1>
            <p className="text-center mb-6 text-gray-600">
              Please configure your Supabase credentials to use this application
            </p>
            <SupabaseSetup />
          </>
        ) : (
          <ForgotPasswordForm />
        )}
      </div>
    </div>
  );
}
