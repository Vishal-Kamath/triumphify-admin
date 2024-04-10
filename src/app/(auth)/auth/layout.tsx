import Image from "next/image";
import { FC, ReactNode, Suspense } from "react";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main
      style={{
        backgroundImage: "url('/auth-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="padding-x flex flex-col h-full min-h-screen w-full gap-9 items-center justify-start py-6 lg:justify-center"
    >
      <div className="w-full max-w-sm flex justify-start">
        <Image
          src="/logo.svg"
          alt="Triumphify Logo"
          width={500}
          height={500}
          className="w-[12.5rem]"
        />
      </div>
      <Suspense>{children}</Suspense>
    </main>
  );
};

export default AuthLayout;
