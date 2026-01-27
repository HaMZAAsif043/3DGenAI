import Link from 'next/link';
import { Box, LayoutDashboard, UploadCloud, History, Settings } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col">
                <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <Box className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold">3DGen AI</span>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" />
                    <NavItem href="/dashboard/upload" icon={<UploadCloud className="w-5 h-5" />} label="New Generation" />
                    <NavItem href="#" icon={<History className="w-5 h-5" />} label="History" />
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <NavItem href="#" icon={<Settings className="w-5 h-5" />} label="Settings" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:pl-64 min-h-screen">
                <div className="p-8 max-w-6xl mx-auto">
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors font-medium"
        >
            {icon}
            {label}
        </Link>
    );
}
