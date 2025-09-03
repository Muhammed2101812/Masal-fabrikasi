"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="layout-container mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="Masal Fabrikası Logosu" width={60} height={60} />
          <h1 className="font-chewy text-3xl font-bold text-gray-800">
            Masal Fabrikası
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          {/* Navigation links removed for cleaner MVP */}
        </div>
      </div>
    </header>
  );
}
