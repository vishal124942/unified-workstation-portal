
import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
