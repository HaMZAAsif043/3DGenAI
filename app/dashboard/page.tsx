'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Plus, History, ArrowUpRight, Sparkles, Layout, Database, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Options as DemoOptions } from '@/lib/demo-data';

export default function DashboardOverview() {
    const featuredModel = DemoOptions[0];

    return (
        <div className="min-h-screen pt-4 pb-20 space-y-12 animate-fade-in relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4 md:px-0">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-zinc-950 uppercase tracking-tighter">Command Center</h1>
                    <p className="text-zinc-500 font-medium text-lg">Orchestrate your 3D assets and generative workflows.</p>
                </div>
                <Link href="/dashboard/upload" className="flex items-center gap-2 px-8 py-4 bg-zinc-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all btn-hover-effect cursor-pointer shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
                    <Plus className="w-5 h-5" />
                    Create New Asset
                </Link>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4 md:px-0">
                <StatCard icon={<Layout className="w-5 h-5" />} title="Total Generations" value="12" sub="Across all projects" color="bg-blue-600" />
                <StatCard icon={<Database className="w-5 h-5" />} title="Storage Used" value="1.2 GB" sub="Of 5.0 GB limit" color="bg-accent" />
                <StatCard icon={<Activity className="w-5 h-5" />} title="Engine Status" value="Online" sub="Real-time V2.0 Active" color="bg-green-600" />
            </div>

            {/* Featured & Recent */}
            <div className="max-w-7xl mx-auto px-4 md:px-0 grid lg:grid-cols-3 gap-10">
                {/* Left: Featured Model (Jacket) */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Featured Asset</h2>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 relative overflow-hidden group border border-zinc-100"
                    >
                        <div className="absolute top-4 right-4 z-20">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200">READY</span>
                        </div>
                        <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative bg-zinc-50">
                            <img
                                src={featuredModel.image}
                                alt={featuredModel.label}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-6" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight">{featuredModel.currentModel.label}</h3>
                            <div className="flex justify-between items-center text-sm border-t border-zinc-50 pt-4">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Material</span>
                                <span className="text-zinc-900 font-black text-xs">{featuredModel.currentModel.details.material}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Optimized</span>
                                <span className="text-zinc-900 font-black text-xs">WebAR v2.0</span>
                            </div>
                            <Link
                                href={`/dashboard/viewer/${featuredModel.currentModel.id}`}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-50 text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-zinc-100 transition-all btn-hover-effect cursor-pointer border border-zinc-100"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                                Inspect Details
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Center/Right: Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 px-1">Recent Activity</h2>
                        <Link href="#" className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1 hover:underline">
                            Full History <History className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="bg-zinc-50/50 rounded-[2.5rem] p-4 border border-zinc-100 shadow-sm min-h-[460px]">
                        <EmptyState />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, sub, color }: { icon: React.ReactNode; title: string; value: string; sub: string; color: string }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-100/50 flex items-start gap-6 relative overflow-hidden group transition-all"
        >
            <div className={`w-14 h-14 ${color} text-white rounded-[1.25rem] flex items-center justify-center shadow-lg relative z-10 transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black tracking-tighter text-zinc-950 leading-tight">{value}</p>
                    {title.includes("Engine") && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </div>
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide mt-1">{sub}</p>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="h-full py-24 flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 bg-white border border-zinc-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-zinc-200/20">
                <Box className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-3 text-zinc-950 uppercase">Asset Archive Empty</h3>
            <p className="text-zinc-500 font-medium mb-12 max-w-xs mx-auto text-sm leading-relaxed">
                Your future creations will materialize here. Start the engine to see your first 3D asset in life-size AR.
            </p>
            <Link href="/dashboard/upload" className="px-10 py-5 bg-accent text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-accent/30 hover:shadow-accent/40 transition-all btn-hover-effect cursor-pointer flex items-center gap-3">
                <Plus className="w-5 h-5" />
                Initiate Generation
            </Link>
        </div>
    );
}
