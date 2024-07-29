import { SignUp } from "@clerk/nextjs";

export const SignUpPage = () => {
  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
