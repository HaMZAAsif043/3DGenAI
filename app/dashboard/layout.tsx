'use client';

import Link from 'next/link';
import { Box, LayoutDashboard, UploadCloud, History, Settings, LogOut, User } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        // await logout();
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { href: '/dashboard/upload', icon: UploadCloud, label: 'New Generation' },
        { href: '#', icon: History, label: 'History' },
        { href: '#', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Pivot to Black */}
            <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col fixed h-full z-50">
                <div className="p-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/Gen3DAI_logo_2.png"
                            alt="Gen3DAI"
                            className="h-24 w-auto group-hover:scale-110 transition-transform"
                        />
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${isActive
                                    ? 'bg-zinc-800 text-white shadow-lg'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-zinc-500 group-hover:text-white'}`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-zinc-800">
                    <Link
                        href="/login"
                        className="flex items-center gap-4 px-6 py-4 text-zinc-500 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area (Stays Professional White) */}
            <main className="flex-grow ml-72">
                <div className="p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-950 hover:bg-white hover:shadow-sm hover:border-zinc-100 border border-transparent transition-all font-bold text-sm group"
        >
            <span className="group-hover:text-accent transition-colors">{icon}</span>
            {label}
        </Link>
    );
}
