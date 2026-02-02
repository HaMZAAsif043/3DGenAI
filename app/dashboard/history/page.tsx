'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Download, Share2, Trash2, ArrowUpRight, Clock, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Options as DemoOptions } from '@/lib/demo-data';

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const historyItems = DemoOptions.map((opt, i) => ({
        id: opt.currentModel.id,
        name: opt.label,
        image: opt.image,
        date: new Date(Date.now() - (i * 86400000 + 3600000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'READY',
        mode: i % 2 === 0 ? 'PRO' : 'RAPID',
        vertices: '142K'
    }));

    const filteredItems = historyItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-4 pb-20 space-y-12 animate-fade-in relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-4 md:px-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 text-zinc-950 uppercase">Asset Archive</h1>
                        <p className="text-zinc-500 font-medium text-lg">Manage and re-visit your generated topologies.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-accent/30 transition-all shadow-sm"
                            />
                        </div>
                        <button className="p-4 bg-zinc-950 text-white rounded-2xl hover:bg-black transition-all btn-hover-effect cursor-pointer">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {filteredItems.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {filteredItems.map((item, idx) => (
                                <HistoryCard key={item.id} item={item} idx={idx} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 flex flex-col items-center text-center px-10 bg-zinc-50/50 rounded-[3rem] border border-dashed border-zinc-200"
                        >
                            <div className="w-16 h-16 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Search className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight">No Archives Found</h3>
                            <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">We couldn't find any assets matching your search criteria.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function HistoryCard({ item, idx }: { item: any, idx: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white p-5 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/40 hover:shadow-2xl hover:shadow-accent/5 transition-all relative overflow-hidden"
        >
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative mb-6 bg-zinc-100">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-3 py-1.5 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest uppercase border border-white/20 shadow-lg ${item.mode === 'PRO' ? 'bg-accent/80 text-white' : 'bg-black/80 text-white'
                        }`}>
                        {item.mode}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                    <Link
                        href={`/dashboard/viewer/${item.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl"
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" /> Inspect
                    </Link>
                    <div className="flex gap-2">
                        <button className="p-2 bg-black/60 text-white rounded-lg hover:bg-black transition-all">
                            <Download className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2 bg-black/60 text-white rounded-lg hover:bg-black transition-all">
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight leading-none mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{item.date}</span>
                        </div>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-50">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest border-b border-transparent">Vertex Count</span>
                        <span className="text-[10px] font-black text-zinc-950 mt-0.5 uppercase tracking-wider">{item.vertices}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Topology</span>
                        <span className="text-[10px] font-black text-accent mt-0.5 uppercase tracking-wider">Verified</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
