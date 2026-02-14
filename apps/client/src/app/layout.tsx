import type { Metadata } from "next";
import { Outfit, Inter, Cinzel, Cormorant } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Preloader } from "@/components/ui/preloader";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Premium Serif for Preloader/Landing only
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Ultra-Premium Nature Serif for History
const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "SelvaWasi - Turismo en la Amazonía",
  description: "Tu puerta de entrada a la selva. Barcos, rutas y experiencias exclusivas.",
  icons: {
    icon: "/images/logo.png",
  },
};

import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable} ${cinzel.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans bg-background text-foreground">
        <AuthProvider>
          <Preloader />
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
