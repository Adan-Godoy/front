// app/layout.tsx
"use client";

import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Navbar  from "../components/Navbar";
import { useState, useEffect } from "react";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="es">
      <body>
        <FavoritesProvider>
          <CartProvider>
            <SessionProvider >
                <ThemeProvider attribute="class">
                  <Navbar />
                  <main>{children}</main>
                </ThemeProvider>    
            </SessionProvider>
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
