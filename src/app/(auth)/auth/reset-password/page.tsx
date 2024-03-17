import { FC, Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

const ResetPasswordPage: FC = () => {
  return (
    <main className="padding-x flex h-full min-h-screen w-full items-center justify-center">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
};

export default ResetPasswordPage;
