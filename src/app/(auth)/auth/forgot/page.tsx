import { FC } from "react";
import ForgotPasswordForm from "./forgot-password-form";

const ForgotPasswordPage: FC = () => {
  return (
    <main className="padding-x flex h-full min-h-screen w-full items-center justify-center">
      <ForgotPasswordForm />
    </main>
  );
};

export default ForgotPasswordPage;
