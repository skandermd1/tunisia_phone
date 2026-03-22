import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tunisia Phone - Boutique de Téléphones & Accessoires",
  description: "Votre boutique de confiance pour téléphones et accessoires en Tunisie. Smartphones, AirPods, chargeurs, coques et plus encore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
