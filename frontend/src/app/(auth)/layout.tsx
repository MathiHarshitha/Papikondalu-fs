import Link from 'next/link';
import { Anchor } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-godavari-800 to-godavari-900 text-white p-12">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Anchor className="w-7 h-7" />
          <span>Papikondalu Tourism</span>
        </Link>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Your Adventure Awaits</h2>
          <p className="text-white/70 text-lg leading-relaxed">Join thousands of travellers who have experienced the magic of Papikondalu. Book your dream boat journey today.</p>
        </div>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Papikondalu Tourism</p>
      </div>
      {/* Right side - form */}
      <div className="flex flex-col items-center justify-center p-8">{children}</div>
    </div>
  );
}
