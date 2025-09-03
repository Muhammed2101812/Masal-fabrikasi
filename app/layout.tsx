// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import { Plus_Jakarta_Sans, Chewy } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chewy",
});

export const metadata: Metadata = {
  title: "Masal Fabrikası - Yapay Zeka Destekli Hikaye Üretici",
  description: "Çocuklar için Türkçe, güvenli ve yaşa uygun kişiselleştirilmiş hikayeler üretin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className={`${plusJakartaSans.variable} ${chewy.variable}`} style={{ fontFamily: 'var(--font-plus-jakarta-sans), sans-serif' }}>
        <ErrorBoundary>
          <Header />
          {children}
          
          {/* ElevenLabs Attribution Footer */}
          <footer className="text-center py-4 text-sm text-slate-500 bg-white/80">
            <p>
              Seslendirme 
              <a 
                href="https://elevenlabs.io/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-slate-700"
              >
                ElevenLabs
              </a> 
              tarafından yapılmıştır.
            </p>
          </footer>
        </ErrorBoundary>
      </body>
    </html>
  );
}