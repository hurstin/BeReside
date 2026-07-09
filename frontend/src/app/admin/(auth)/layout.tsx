import React from 'react';
import Link from 'next/link';
import { Hotel } from 'lucide-react';

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-zinc-100 p-2 rounded-lg group-hover:bg-white transition-colors">
              <Hotel className="h-8 w-8 text-zinc-950" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-100">BeReside<span className="text-zinc-500 font-normal">Staff</span></span>
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-zinc-900/50 backdrop-blur-xl py-8 px-4 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:px-10 border border-zinc-800/50">
          {children}
        </div>
      </div>
    </div>
  );
}
