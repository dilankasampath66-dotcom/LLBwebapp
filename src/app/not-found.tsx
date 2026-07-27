import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161B] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C1619] via-[#14161B] to-[#14161B] p-4 text-center">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500 flex flex-col items-center">
        <h1 className="font-serif text-8xl font-bold text-[#D4AF37] tracking-tighter mb-4">
          404
        </h1>
        <h2 className="font-serif text-3xl text-[#EBEBEB] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#999999] mb-8 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-[#14161B] disabled:opacity-50 disabled:pointer-events-none bg-[#801734] text-white hover:bg-[#6b132b] h-10 py-2 px-6 shadow-lg shadow-[#801734]/20"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
