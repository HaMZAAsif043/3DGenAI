'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Box, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 shadow-xl">
                        <Box className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">3DGen AI</h1>
                    <p className="text-zinc-500 mt-2">
                        {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to start generating 3D models.'}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
                                <div className="mt-2 relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 ml-1">Password</label>
                                <div className="mt-2 relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
                        <p className="text-zinc-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-bold text-black border-b-2 border-black/10 hover:border-black transition-all"
                            >
                                {isLogin ? 'Create Account' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors">
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
