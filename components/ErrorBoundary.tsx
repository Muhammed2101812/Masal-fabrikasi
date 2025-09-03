// components/ErrorBoundary.tsx
'use client';

import React, { useState, useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      setHasError(true);
      Sentry.captureException(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      Sentry.captureException(event.reason);
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    // You can render any custom fallback UI
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Bir şeyler ters gitti!</h2>
          <p className="text-slate-600 mb-6">
            Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return children;
}