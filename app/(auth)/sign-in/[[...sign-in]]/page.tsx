import { SignIn } from "@clerk/nextjs";

export const SignInPage = () => {
  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignIn />
    </div>
  );
};

export default SignInPage;
