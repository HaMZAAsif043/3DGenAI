'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, User, Sparkles, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
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
            // Simulation of registration
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration sequence interrupted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-accent/30 selection:text-zinc-950">
            {/* Visual Column */}
            <div className="hidden lg:flex relative bg-zinc-950 items-center justify-center p-20 overflow-hidden order-last">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(79,70,229,0.1),transparent)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none text-white" />

                {/* Floating Elements */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] border border-white/5 rounded-full"
                />

                <div className="relative z-10 max-w-lg space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="px-4 py-2 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20 mb-8 inline-block">Early Access v2.0</span>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight italic">
                            Infinite Dimensions. <br />
                            <span className="text-accent underline decoration-white/20 underline-offset-8">Zero Constraints.</span>
                        </h2>
                        <p className="text-zinc-400 mt-6 text-lg font-medium leading-relaxed">
                            Join the elite circle of spatial designers utilizing the world's most advanced image-to-3D pipeline.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4">
                        <BenefitCard
                            icon={<Zap className="w-5 h-5 text-accent" />}
                            title="Instant Materialization"
                            desc="Go from 2D concept to 3D asset in under 120 seconds."
                        />
                        <BenefitCard
                            icon={<Layers className="w-5 h-5 text-blue-500" />}
                            title="Hybrid Export Suite"
                            desc="Native support for GLB, USDZ, and cinematic MTL formats."
                        />
                    </div>

                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                        <div className="flex -space-x-4 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800" />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-accent flex items-center justify-center text-[10px] font-black text-white">+8k</div>
                        </div>
                        <p className="text-xs text-zinc-400 font-bold italic">"Gen3DAI has completely transformed our architectural visualization workflow."</p>
                        <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-2">— Lead Designer, Spatial Corp</p>
                    </div>
                </div>
            </div>

            {/* Form Column */}
            <div className="flex items-center justify-center p-8 md:p-20 relative bg-white">
                <div className="max-w-md w-full space-y-12">
                    {/* Header */}
                    <div className="space-y-4">
                        <img src="/Gen3DAI_logo_2.png" alt="Gen3DAI Logo" className="h-12 w-auto brightness-0 lg:block hidden" />
                        <div className="lg:hidden text-center">
                            <img src="/Gen3DAI_logo_2.png" alt="Gen3DAI Logo" className="h-16 w-auto mx-auto brightness-0 mb-6" />
                        </div>
                        <h3 className="text-3xl font-black text-zinc-950 uppercase tracking-tighter italic">Create Identity</h3>
                        <p className="text-zinc-500 font-medium">Initialize your operator profile and claim your workspace.</p>
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
                                label="Operator Name"
                                type="text"
                                placeholder="E.g. Alex North"
                                icon={<User className="w-5 h-5 text-zinc-400" />}
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                            />

                            <InputField
                                label="Communications Terminal"
                                type="email"
                                placeholder="operator@gen3d.ai"
                                icon={<Mail className="w-5 h-5 text-zinc-400" />}
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                            />

                            <InputField
                                label="Secure Access Pass"
                                type="password"
                                placeholder="Min. 8 characters"
                                icon={<Lock className="w-5 h-5 text-zinc-400" />}
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                            />
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
                                    Initialize Protocol
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-10 border-t border-zinc-50 text-center space-y-6">
                        <p className="text-zinc-500 font-medium text-sm italic">
                            Already established?
                            <Link
                                href="/login"
                                className="ml-2 font-black text-zinc-950 hover:text-accent transition-all uppercase text-[11px] tracking-widest border-b-2 border-accent pb-1"
                            >
                                Re-establish Link
                            </Link>
                        </p>
                    </div>

                    <p className="text-[9px] text-zinc-400 text-center font-bold uppercase tracking-widest leading-relaxed">
                        By initializing, you agree to the <br />
                        <span className="text-zinc-950">Spatial Usage Agreement</span> & <span className="text-zinc-950">Data Privacy Protocol</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm font-black text-white uppercase tracking-tight">{title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
            </div>
        </div>
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
