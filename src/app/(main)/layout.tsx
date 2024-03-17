import NavBar from "@/components/nav/nav";
import AuthProvider from "@/components/providers/auth.provider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavBar>
      <AuthProvider>{children}</AuthProvider>
    </NavBar>
  );
}
