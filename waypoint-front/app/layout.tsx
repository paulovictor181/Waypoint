import { AuthProvider } from "@/context/AuthContext"; // Importe
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waypoint", // Nome que aparecerá na aba
  description: "Seu planejador de viagens e roteiros", // Descrição para SEO
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-white text-black">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
