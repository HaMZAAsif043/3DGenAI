'use client';

import React, { useState } from 'react';
import { User, Shield, Zap, Bell, Monitor, Key, Save, AlertCircle, Cpu, Cloud, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'engine', label: 'Engine V2', icon: Cpu },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Alerts', icon: Bell },
    ];

    return (
        <div className="min-h-screen pt-4 pb-20 space-y-12 animate-fade-in relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-4 md:px-0">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter mb-2 text-zinc-950 uppercase">System Settings</h1>
                    <p className="text-zinc-500 font-medium text-lg">Configure your generative workflow and account preferences.</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-12 items-start">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${isActive
                                            ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-200'
                                            : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : ''}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-zinc-50/50 border border-zinc-100 p-10 md:p-12 rounded-[3.5rem] shadow-sm space-y-10"
                        >
                            {activeTab === 'profile' && <ProfileSettings />}
                            {activeTab === 'engine' && <EngineSettings />}
                            {activeTab === 'security' && <SecuritySettings />}
                            {activeTab === 'notifications' && <div className="py-20 text-center text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">No notification history found.</div>}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileSettings() {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                <h3 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">Identity Profile</h3>
                <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all">
                    <Save className="w-3.5 h-3.5" /> Commit Changes
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Display Name</label>
                    <input type="text" defaultValue="Arch Architect" className="w-full p-5 bg-white border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent/30 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Organization</label>
                    <input type="text" defaultValue="Gen3D Studios" className="w-full p-5 bg-white border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent/30 transition-all shadow-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Email Terminal</label>
                    <input type="email" defaultValue="architect@gen3dai.com" className="w-full p-5 bg-white border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent/30 transition-all shadow-sm" />
                </div>
            </div>
        </div>
    );
}

function EngineSettings() {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                <h3 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">Engine V2.0 Config</h3>
                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black tracking-widest uppercase border border-green-100">Optimal Performance</span>
            </div>

            <div className="space-y-6">
                <SettingToggle
                    icon={<Zap className="w-4 h-4 text-accent" />}
                    title="Neural Upsampling"
                    desc="Leverage high-fidelity vertex interpolation for smoother surfaces."
                    enabled={true}
                />
                <SettingToggle
                    icon={<Cloud className="w-4 h-4 text-blue-500" />}
                    title="Cloud Sync"
                    desc="Automatically sync materialized assets to your secure cloud archive."
                    enabled={true}
                />
                <SettingToggle
                    icon={<Smartphone className="w-4 h-4 text-zinc-950" />}
                    title="Auto-USDZ Export"
                    desc="Pre-calculate Apple AR models for instant mobile visualization."
                    enabled={false}
                />
            </div>

            <div className="p-6 bg-zinc-950 text-white rounded-[2rem] flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[60px] rounded-full -mr-16 -mt-16" />
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5 relative z-10">
                    <Monitor className="w-7 h-7 text-accent" />
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-black uppercase tracking-tight">VRAM Allocation</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Allocated: 8.4 GB / 24.0 GB</p>
                </div>
            </div>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                <h3 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">Security & Keys</h3>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                            <Key className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight text-zinc-950">Primary API Access Key</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Last rotated: 2 days ago</p>
                        </div>
                    </div>
                    <button className="px-6 py-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-zinc-100">
                        Rotate Token
                    </button>
                </div>

                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-black uppercase tracking-tight">Critical Warning</p>
                        <p className="text-[10px] font-medium leading-relaxed mt-1 opacity-80">Never reveal your private keys. Gen3DAI support will never ask for your credentials terminal-side.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingToggle({ icon, title, desc, enabled }: { icon: React.ReactNode, title: string, desc: string, enabled: boolean }) {
    const [isOn, setIsOn] = useState(enabled);
    return (
        <div className="flex items-center justify-between py-6 px-1 group">
            <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                    {icon}
                </div>
                <div className="max-w-sm">
                    <p className="text-sm font-black uppercase tracking-tight text-zinc-950">{title}</p>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">{desc}</p>
                </div>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-500 shrink-0 ${isOn ? 'bg-accent' : 'bg-zinc-200'}`}
            >
                <motion.div
                    animate={{ x: isOn ? 26 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
            </button>
        </div>
    );
}
