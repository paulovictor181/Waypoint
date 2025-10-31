import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Importe

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-white text-black">
        <AuthProvider>
          {" "}
          {/* Adicione o provedor aqui */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
