import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Importe

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {" "}
          {/* Adicione o provedor aqui */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
