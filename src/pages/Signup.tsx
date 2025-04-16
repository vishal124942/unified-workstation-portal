
import SignupForm from "@/components/auth/SignupForm";
import SupabaseSetupGuide from "@/components/setup/SupabaseSetupGuide";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
      <div className="mt-4">
        <SupabaseSetupGuide />
      </div>
    </div>
  );
}
