import AuthGuard from "@/components/AuthGuard";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waypoint",
  description: "Seu planejador de viagens e roteiros",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-white text-black">
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
