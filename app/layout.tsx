import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-50"}>
        {children}
          <Toaster position="top-right" richColors />

      </body>
    </html>
  );
}
