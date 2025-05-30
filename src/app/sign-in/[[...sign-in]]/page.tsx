import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-white",
              card: "bg-white border border-gray-200 shadow-xl",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
              formFieldLabel: "text-gray-700",
              formFieldInput: "bg-white border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500",
              footerActionLink: "text-primary-600 hover:text-primary-700",
              identityPreviewText: "text-gray-900",
              identityPreviewEditButton: "text-primary-600 hover:text-primary-700",
              formFieldInputShowPasswordButton: "text-gray-600 hover:text-gray-800",
              formFieldAction: "text-primary-600 hover:text-primary-700",
              formResendCodeLink: "text-primary-600 hover:text-primary-700",
              otpCodeFieldInput: "bg-white border-gray-300 text-gray-900 focus:border-primary-500",
            },
          }}
        />
      </div>
    </div>
  );
}