import { FC } from "react";
import LoginForm from "./login-form";

const LoginPage: FC = () => {
  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
