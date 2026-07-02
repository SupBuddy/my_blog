import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <SignUp 
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white dark:bg-zinc-900 shadow-none border border-zinc-200 dark:border-zinc-800',
          },
        }}
      />
    </div>
  );
}