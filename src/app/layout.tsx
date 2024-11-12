// app/layout.tsx
"use client";

import type { ReactNode } from "react";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import client from "../lib/api/apolloClient";
import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";

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
        <ApolloProvider client={client}>
          <SessionProvider >
            {mounted ? (
              <ThemeProvider attribute="class">
                <Navbar />
                <main>{children}</main>
              </ThemeProvider>
            ) : (
              <main>{children}</main>
            )}
          </SessionProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
