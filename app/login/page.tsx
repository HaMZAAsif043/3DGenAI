'use client';

import React, { useState } from 'react';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Box, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
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
            if (isLogin) {
                // await signInWithEmailAndPassword(auth, email, password);
            } else {
                // await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center mb-8 btn-hover-effect">
                        <img
                            src="/Gen3DAI_logo_2.png"
                            alt="Gen3DAI Logo"
                            className="h-24 w-auto "
                        />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter text-white uppercase mb-2">Gen3DAI Protocol</h1>
                    <p className="text-zinc-500 font-medium text-sm uppercase tracking-widest">
                        {isLogin ? 'Command Center Access' : 'Create Operator Profile'}
                    </p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Identity Vector</label>
                                <div className="mt-3 relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-zinc-950 placeholder:text-zinc-300 font-medium"
                                        placeholder="operator@gen3d.ai"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Access Pass</label>
                                <div className="mt-3 relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-zinc-950 placeholder:text-zinc-300 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all btn-hover-effect disabled:opacity-50 shadow-xl shadow-zinc-200"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Establish Link' : 'Register Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-zinc-50 text-center">
                        <p className="text-zinc-400 font-medium text-sm">
                            {isLogin ? "New to Gen3DAI?" : "Already Registered?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-black text-zinc-950 hover:text-accent transition-all uppercase text-[10px] tracking-widest border-b border-zinc-950"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <span>← Internal Return</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
