'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Box, LayoutDashboard, UploadCloud, History, Settings, LogOut, User, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        // await logout();
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { href: '/dashboard/upload', icon: UploadCloud, label: 'New Generation' },
        { href: '/dashboard/history', icon: History, label: 'History' },
        { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Pivot to Black */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="bg-zinc-950 border-r border-zinc-800 flex flex-col fixed h-full z-50 overflow-hidden"
            >
                <div className={`flex flex-col items-center justify-center py-10 transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-8'}`}>
                    <Link href="/" className="flex items-center justify-center group">
                        <Image
                            width={100}
                            height={100}
                            src={isCollapsed ? "/Gen3DAI_logo_1.png" : "/Gen3DAI_logo_2.png"}
                            alt="Gen3DAI"
                            className="h-24 w-auto group-hover:scale-110 transition-transform"
                        />
                    </Link>
                </div>

                <nav className="flex-grow flex flex-col items-center px-4 space-y-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center justify-center rounded-2xl transition-all group relative ${isCollapsed ? 'w-12 h-12' : 'w-full px-5 py-4 gap-4'} ${isActive
                                    ? 'bg-zinc-800 text-white shadow-lg'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                    }`}
                            >
                                <Icon className={`shrink-0 w-6 h-6 ${isActive ? 'text-accent' : 'text-zinc-500 group-hover:text-white'}`} />
                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap flex-grow"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-[-16px] w-1.5 h-6 bg-accent rounded-r-full shadow-[4px_0_15px_rgba(var(--accent-rgb),0.5)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-zinc-900 flex flex-col items-center">
                    <Link
                        href="/login"
                        className={`flex items-center justify-center text-zinc-500 hover:text-white transition-colors group ${isCollapsed ? 'w-12 h-12' : 'w-full px-5 py-4 gap-4'}`}
                    >
                        <LogOut className="shrink-0 w-6 h-6 group-hover:text-red-500 transition-colors" />
                        {!isCollapsed && (
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap flex-grow">
                                Sign Out
                            </span>
                        )}
                    </Link>
                </div>
            </motion.aside>

            <motion.main
                initial={false}
                animate={{ marginLeft: isCollapsed ? 80 : 280 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="flex-grow relative"
            >
                {/* Floating Toggle Button - Perfectly centered on the border */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="fixed top-12 z-[60] w-7 h-7 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-full flex items-center justify-center shadow-xl hover:bg-accent hover:text-white hover:border-accent transition-all group"
                    style={{
                        left: isCollapsed ? '66px' : '266px',
                        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </motion.div>
                </button>

                <div className="p-6 md:p-8 lg:p-12">
                    {children}
                </div>
            </motion.main>
        </div>
    );
}
