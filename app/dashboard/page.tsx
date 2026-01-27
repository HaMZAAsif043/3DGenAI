import Link from 'next/link';
import { Box, Plus, History, ArrowUpRight } from 'lucide-react';

export default function DashboardOverview() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-zinc-500">Welcome back. Manage your 3D assets and generations.</p>
                </div>
                <Link href="/dashboard/upload" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg">
                    <Plus className="w-5 h-5" />
                    New Model
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard title="Total Generations" value="12" sub="Across all projects" />
                <StatCard title="Storage Used" value="1.2 GB" sub="Of 5.0 GB limit" />
                <StatCard title="Active Jobs" value="0" sub="Processsed in real-time" />
            </div>

            {/* Recent Models */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Recent Models</h2>
                    <Link href="#" className="text-sm font-medium text-accent flex items-center gap-1 hover:underline">
                        View All <History className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <EmptyState />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
    return (
        <div className="p-6 bg-white rounded-3xl border border-zinc-200">
            <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-2">{value}</p>
            <p className="text-xs text-zinc-400">{sub}</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold mb-1">No models generated yet</h3>
            <p className="text-zinc-500 mb-6">Start by uploading an image to create your first 3D asset.</p>
            <Link href="/dashboard/upload" className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Create Your First Model <ArrowUpRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
