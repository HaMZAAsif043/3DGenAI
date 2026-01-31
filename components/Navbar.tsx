'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-[100] bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 h-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-full">
                <div className="flex justify-between h-full items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="btn-hover-effect">
                            <img src="/Gen3DAI_logo_2.png" alt="Gen3DAI Logo" className="h-16 w-auto" />
                        </Link>
                        <span className="text-xl font-bold tracking-tight sr-only">Gen3DAI</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                            <Link href="/#features" className="hover:text-white transition-colors">Technology</Link>
                            <Link href="/#showcase" className="hover:text-white transition-colors">Showcase</Link>
                            <Link href="/#enterprise" className="hover:text-white transition-colors">Enterprise</Link>
                        </div>

                        <div className="flex items-center gap-4 border-l border-zinc-800 pl-10">
                            <Link
                                href="/login"
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-6 py-2.5 bg-white text-zinc-950 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all btn-hover-effect flex items-center gap-2"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Launch App
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
