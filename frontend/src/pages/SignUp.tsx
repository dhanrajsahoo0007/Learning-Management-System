import { SignUp } from '@clerk/clerk-react';

const clerkAppearance = {
  variables: {
    colorPrimary: '#4f46e5',
    colorBackground: 'transparent',
    colorText: 'inherit',
  },
  elements: {
    rootBox: 'mx-auto',
    card: 'shadow-none border bg-card',
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        appearance={clerkAppearance}
      />
    </div>
  );
}
