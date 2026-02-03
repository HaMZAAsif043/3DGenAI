'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, Sparkles, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("api/auth/login",{
                method:"POST",
                headers:{
                    "content-type":"application/json",

                },
                body:JSON.stringify({
                  password,
                  email  
                })
            })
            console.log(res)
            // Simulation of auth - to be connected to Firebase/Backend
            await new Promise(resolve => setTimeout(resolve, 1500));
            // router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication sequence failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-accent/30 selection:text-zinc-950">
            {/* Visual Column - Hidden on mobile */}
            <div className="hidden lg:flex relative bg-zinc-950 items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.1),transparent)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-64 h-64 bg-accent/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full"
                />

                <div className="relative z-10 max-w-lg space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <img src="/Gen3DAI_logo_2.png" alt="Gen3DAI Logo" className="h-20 w-auto mb-10" />
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight italic">
                            The Next Phase of <span className="text-accent underline decoration-white/20 underline-offset-8">Spatial Intelligence</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-6">
                        <FeatureItem
                            icon={<Sparkles className="w-5 h-5 text-accent" />}
                            title="Neural Sculpting Engine v2.0"
                            desc="Proprietary vertex generation with higher topology density."
                        />
                        <FeatureItem
                            icon={<ShieldCheck className="w-5 h-5 text-blue-500" />}
                            title="Production Grade Mesh"
                            desc="Automatically UV-unwrapped and optimized for WebGL."
                        />
                        <FeatureItem
                            icon={<Globe className="w-5 h-5 text-purple-500" />}
                            title="AR Universal Pipeline"
                            desc="Instant deployment to iOS and Android spatial viewers."
                        />
                    </div>

                    <div className="pt-10 flex items-center gap-8 border-t border-white/10">
                        <div>
                            <p className="text-2xl font-black text-white">12k+</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Assets Generated</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                            <p className="text-2xl font-black text-white">4.9/5</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Artist Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Column */}
            <div className="flex items-center justify-center p-8 md:p-20 relative bg-white">
                <div className="max-w-md w-full space-y-12">
                    {/* Header for Mobile */}
                    <div className="lg:hidden text-center space-y-4">
                        <img src="/Gen3DAI_logo_2.png" alt="Gen3DAI Logo" className="h-20 w-auto mx-auto bg-black rounded" />
                        <h2 className="text-3xl font-black text-zinc-950 uppercase tracking-tighter italic">Establish Connection</h2>
                    </div>

                    <div className="hidden lg:block space-y-2">
                        <h3 className="text-3xl font-black text-zinc-950 uppercase tracking-tighter">System Access</h3>
                        <p className="text-zinc-500 font-medium">Identify yourself to access the 3D generation protocol.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-red-50 text-red-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-center border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <InputField
                                label="Protocol Identity"
                                type="email"
                                placeholder="operator@gen3d.ai"
                                icon={<Mail className="w-5 h-5 text-zinc-400" />}
                                value={email}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />

                            <InputField
                                label="Security Access Pass"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5 text-zinc-400" />}
                                value={password}
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  setPassword(e.target.value)
}                            />

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-zinc-200 text-accent focus:ring-accent" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-950 transition-colors">Keep Session Active</span>
                                </label>
                                <button type="button" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-accent transition-all underline underline-offset-4">Reset Credentials</button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all group btn-hover-effect disabled:opacity-50 shadow-2xl shadow-zinc-200"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Establish Link
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-10 border-t border-zinc-50 text-center space-y-6">
                        <p className="text-zinc-500 font-medium text-sm italic">
                            New operator?
                            <Link
                                href="/signup"
                                className="ml-2 font-black text-zinc-950 hover:text-accent transition-all uppercase text-[11px] tracking-widest border-b-2 border-accent pb-1"
                            >
                                Join the Protocol
                            </Link>
                        </p>
                    </div>

                    <Link href="/" className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors py-4">
                        <div className="w-8 h-[1px] bg-zinc-200" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Public Web</span>
                        <div className="w-8 h-[1px] bg-zinc-200" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div
            whileHover={{ x: 10 }}
            className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
        >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <div>
                <p className="text-sm font-black text-white uppercase tracking-tight">{title}</p>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed opacity-70 italic">{desc}</p>
            </div>
        </motion.div>
    );
}

function InputField({ label, type, placeholder, icon, value, onChange }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mx-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-accent">
                    {icon}
                </div>
                <input
                    type={type}
                    required
                    value={value}
                    onChange={onChange}
                    className="w-full pl-16 pr-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all text-zinc-950 placeholder:text-zinc-300 font-bold shadow-sm"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}
