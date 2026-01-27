'use client';

import React, { useState, useEffect } from 'react';
import { Box, Sparkles, Loader2, CheckCircle2, AlertCircle, Download, Smartphone, QrCode, X as CloseX } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import ModelViewer from '@/components/ModelViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export default function UploadPage() {
    const [status, setStatus] = useState<JobStatus>('idle');
    const [jobId, setJobId] = useState<string | null>(null);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showQR, setShowQR] = useState(false);

    // Poll status when processing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'processing' && jobId) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/status/${jobId}`);
                    const data = await res.json();

                    if (data.Status === 'SUCCESS') {
                        setStatus('completed');
                        setModelUrl(data.ResultUrl);
                        setJobId(null);
                        clearInterval(interval);
                    } else if (data.Status === 'FAILED') {
                        setStatus('failed');
                        setErrorMessage(data.ErrorMsg || 'Generation failed');
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [status, jobId]);

    const handleStartGeneration = async (files: File[]) => {
        if (files.length === 0) return;

        setStatus('uploading');
        setErrorMessage(null);
        setProgress(20);

        try {
            // In a real app, you'd upload the files to a storage service first.
            // For this demo, we'll convert to base64 or a temporary URL.
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = async () => {
                const base64 = reader.result;

                setProgress(40);
                setStatus('processing');

                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ images: [base64], mode: 'pro' }),
                });

                const data = await res.json();
                if (data.jobId) {
                    setJobId(data.jobId);
                    setProgress(60);
                } else {
                    throw new Error(data.error || 'Failed to start job');
                }
            };
        } catch (err: any) {
            setStatus('failed');
            setErrorMessage(err.message);
        }
    };

    const downloadModel = async () => {
        if (!modelUrl) return;
        try {
            const response = await fetch(modelUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `model-${Date.now()}.glb`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create New 3D Model</h1>
                    <p className="text-zinc-500">Upload images to generate a high-fidelity 3D asset.</p>
                </div>
                <div className="hidden md:flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 text-accent rounded-full text-sm font-medium border border-accent/10">
                        <Sparkles className="w-4 h-4" />
                        V2 Model Active
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Input */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                        <UploadZone onFilesSelected={(files) => {
                            if (status === 'idle' || status === 'completed') {
                                handleStartGeneration(files);
                            }
                        }} />

                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Generation Settings</h4>
                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Hunyuan3D V2 Pro</p>
                                        <p className="text-xs text-zinc-500">Highest quality, slower generation</p>
                                    </div>
                                </div>
                                <div className="w-12 h-6 bg-accent rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Tracker */}
                    <AnimatePresence>
                        {status !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className={`p-6 rounded-3xl border ${status === 'failed' ? 'bg-red-50 border-red-100 text-red-900' :
                                    status === 'completed' ? 'bg-green-50 border-green-100 text-green-900' :
                                        'bg-zinc-900 text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {status === 'processing' || status === 'uploading' ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : status === 'completed' ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                    )}

                                    <div className="flex-grow">
                                        <p className="font-bold">
                                            {status === 'uploading' && 'Uploading assets...'}
                                            {status === 'processing' && 'AI is sculpting your model...'}
                                            {status === 'completed' && 'Generation successful!'}
                                            {status === 'failed' && 'Generation failed'}
                                        </p>
                                        <p className={`text-sm ${status === 'processing' || status === 'uploading' ? 'text-zinc-400' : 'opacity-80'}`}>
                                            {status === 'processing' && 'Typical wait time: 2-3 minutes'}
                                            {status === 'completed' && 'Your model is ready for preview and export.'}
                                            {status === 'failed' && errorMessage}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Viewer */}
                <div className="space-y-6">
                    <div className="h-[600px] sticky top-8">
                        <ModelViewer modelUrl={modelUrl} />

                        {status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 grid grid-cols-2 gap-4"
                            >
                                <button
                                    onClick={downloadModel}
                                    className="flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg"
                                >
                                    <Download className="w-5 h-5" />
                                    Download GLB
                                </button>
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="flex items-center justify-center gap-2 py-4 bg-white text-black border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-colors"
                                >
                                    <QrCode className="w-5 h-5" />
                                    Share AR
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQR(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <CloseX className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Smartphone className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold">View in AR</h3>
                                <p className="text-zinc-500 text-sm mt-1">Scan to view the model on your mobile device</p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mb-6 flex justify-center">
                                <QRCodeSVG value={modelUrl || window.location.href} size={200} />
                            </div>

                            <p className="text-xs text-zinc-400">
                                Works on most modern iOS (USDZ) and Android (Scene Viewer) devices.
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
