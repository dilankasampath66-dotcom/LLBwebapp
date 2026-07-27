'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161B] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C1619] via-[#14161B] to-[#14161B] p-4 text-center">
      <div className="max-w-md w-full flex flex-col items-center bg-[#1C1F26] border border-[#2B2F39] rounded-2xl p-8 shadow-2xl">
        <div className="w-16 h-16 bg-[#E53935]/10 text-[#E53935] rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-[#EBEBEB] mb-3">
          Something went wrong
        </h2>
        <p className="text-[#999999] text-sm mb-8">
          {error.message || "An unexpected error has occurred. Our team has been notified."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-[#14161B] disabled:opacity-50 disabled:pointer-events-none bg-[#2B2F39] text-[#EBEBEB] hover:bg-[#383C47] border border-[#383C47] h-10 py-2 px-6"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
