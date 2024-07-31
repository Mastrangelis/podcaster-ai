import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignIn />
    </div>
  );
};

export default SignInPage;
