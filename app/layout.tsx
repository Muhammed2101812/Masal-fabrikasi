// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Hayal Et ve Oku",
  description: "Türkçe, güvenli ve yaşa uygun hikayeler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}