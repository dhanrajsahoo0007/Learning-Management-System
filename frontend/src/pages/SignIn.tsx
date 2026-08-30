import { SignIn } from '@clerk/clerk-react';

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

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        appearance={clerkAppearance}
      />
    </div>
  );
}
