import { signIn } from "next-auth/react";
import React from "react";
import { useRequireNotAuth } from "../../utils/auth";

type Props = {};

const Login = (props: Props) => {
  const session = useRequireNotAuth();
  if (session) return null;
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-md transform flex-col space-y-4 overflow-hidden rounded-2xl bg-white py-12 px-4 text-center align-middle shadow-xl transition-all sm:px-16">
        <h1 className="font-display text-3xl font-bold">Sign In</h1>
        <p className="text-sm text-gray-600">
          Use your discord or github sign in.
        </p>
        <button
          onClick={() => signIn("github")}
          className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none"
        >
          <p>Github</p>
        </button>
        <button
          onClick={() => signIn("discord")}
          className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none"
        >
          <p>Discord</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
