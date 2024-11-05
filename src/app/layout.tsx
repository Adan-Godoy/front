// app/layout.tsx
"use client";

import "./globals.css";
import { Navbar } from "../components/Navbar";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="es">
      
        <body>
          <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </body>
      
      
    </html>
  );
}
