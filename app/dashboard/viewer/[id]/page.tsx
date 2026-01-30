'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Box, Sparkles, Loader2, CheckCircle2, AlertCircle, Download, Smartphone, QrCode, X as CloseX, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import ModelViewer from '@/components/ModelViewer';
import ModelSkeleton from '@/components/ModelSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import * as THREE from 'three';
import { exportToGLB, exportToUSDZ, uploadToCloudinary, triggerDownload } from '@/lib/exporters';

type JobStatus = 'idle' | 'processing' | 'completed' | 'failed';

export default function ViewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const jobId = params.id as string;
    const mode = searchParams.get('mode') || 'pro';

    const [status, setStatus] = useState<JobStatus>('processing');
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showQR, setShowQR] = useState(false);
    const [isExporting, setIsExporting] = useState<'glb' | 'usdz' | null>(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
    const modelGroupRef = React.useRef<THREE.Group>(null);

    useEffect(() => {
        if (!jobId) return;

        let interval: NodeJS.Timeout;
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/status/${jobId}?mode=${mode}`);
                const data = await res.json();

                if (data.Status === 'SUCCESS') {
                    setStatus('completed');
                    setModelUrl(data.ResultUrl);
                    clearInterval(interval);
                } else if (data.Status === 'FAILED') {
                    setStatus('failed');
                    setErrorMessage(data.ErrorMsg || 'Generation failed');
                    clearInterval(interval);
                } else if (data.Status === 'RUNNING') {
                    setStatus('processing');
                }
            } catch (err) {
                console.error('Polling error:', err);
                // We don't necessarily want to fail on a single network error
            }
        };

        // Initial check
        checkStatus();

        // Start polling
        interval = setInterval(checkStatus, 5000);

        return () => clearInterval(interval);
    }, [jobId]);

    const downloadModel = async (format: 'glb' | 'usdz') => {
        if (!modelGroupRef.current) {
            console.error('No model group found for export');
            return;
        }

        try {
            setIsExporting(format);
            if (format === 'glb') {
                const blob = await exportToGLB(modelGroupRef.current);
                triggerDownload(blob, `model-${jobId}.glb`);
            } else {
                const blob = await exportToUSDZ(modelGroupRef.current);
                triggerDownload(blob, `model-${jobId}.usdz`);
            }
        } catch (err) {
            console.error(`${format.toUpperCase()} Export failed:`, err);
        } finally {
            setIsExporting(null);
        }
    };

    const handleShareAR = async () => {
        if (!modelGroupRef.current) return;

        try {
            setIsExporting('usdz');
            const usdzBlob = await exportToUSDZ(modelGroupRef.current);
            const fileName = `model-${jobId}.usdz`;
            const url = await uploadToCloudinary(usdzBlob, fileName);
            setCloudinaryUrl(url);
            setShowQR(true);
        } catch (err) {
            console.error('AR Export/Upload failed:', err);
        } finally {
            setIsExporting(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Model Preview</h1>
                    <p className="text-zinc-500">Job ID: <span className="font-mono text-xs bg-zinc-100 px-2 py-0.5 rounded uppercase">{jobId}</span></p>
                </div>

                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Ready for Export
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 text-accent rounded-full text-sm font-medium border border-accent/10">
                        <Sparkles className="w-4 h-4" />
                        V2 Quality
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Viewer */}
                <div className="lg:col-span-2">
                    <div className="h-[600px] bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm relative group">
                        {status === 'processing' ? (
                            <ModelSkeleton />
                        ) : status === 'failed' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-900 p-8 text-center">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                                <p className="max-w-md opacity-80">{errorMessage || 'An unexpected error occurred during the 3D generation process.'}</p>
                            </div>
                        ) : (
                            <ModelViewer modelUrl={modelUrl} groupRef={modelGroupRef} />
                        )}

                        {status === 'processing' && (
                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white flex items-center gap-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                                    <div>
                                        <p className="font-bold">AI Sculpting...</p>
                                        <p className="text-xs text-zinc-500">Wait time: 1-2 minutes</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions & Details */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Box className="w-5 h-5 text-accent" />
                                Asset Actions
                            </h3>

                            <div className="space-y-4">
                                <button
                                    onClick={() => downloadModel('glb')}
                                    disabled={status !== 'completed' || !!isExporting}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-black text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                                >
                                    {isExporting === 'glb' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                    {isExporting === 'glb' ? 'Exporting...' : 'Download GLB'}
                                </button>

                                <button
                                    onClick={() => downloadModel('usdz')}
                                    disabled={status !== 'completed' || !!isExporting}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-100 text-black border-2 border-zinc-200 rounded-2xl font-bold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isExporting === 'usdz' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
                                    {isExporting === 'usdz' ? 'Exporting...' : 'Download USDZ'}
                                </button>

                                <button
                                    onClick={handleShareAR}
                                    disabled={status !== 'completed' || !!isExporting}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black border-2 border-zinc-100 rounded-2xl font-bold hover:bg-zinc-50 hover:border-zinc-200 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isExporting === 'usdz' ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                                    {isExporting === 'usdz' ? 'Preparing AR...' : 'Share AR'}
                                </button>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-zinc-100">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Generation Info</h4>
                            <div className="space-y-3">
                                <InfoRow label="Model Type" value="Hunyuan3D Pro" />
                                <InfoRow label="Resolution" value="High Fidelity" />
                                <InfoRow label="Estimated Size" value="~15-20 MB" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/10 p-6 rounded-3xl border border-accent/20">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h4 className="font-bold text-accent">AR Preview Ready</h4>
                                <p className="text-sm text-accent/80 mt-1">Exported models are optimized for mobile AR viewers (iOS QuickLook & Android Scene Viewer).</p>
                            </div>
                        </div>
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <CloseX className="w-5 h-5" />
                            </button>

                            <div className="mb-8 mt-4">
                                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Smartphone className="w-10 h-10 text-accent" />
                                </div>
                                <h3 className="text-2xl font-black">View in AR</h3>
                                <p className="text-zinc-500 mt-2">Scan this code with your mobile device to place this model in your room.</p>
                            </div>

                            <div className="bg-zinc-50 p-8 rounded-[32px] border-2 border-zinc-100 mb-8 flex justify-center shadow-inner">
                                <QRCodeSVG value={cloudinaryUrl || `${window.location.origin}/ar/${jobId}`} size={220} includeMargin />
                            </div>



                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                <span className="text-[10px] bg-zinc-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">AR Core</span>
                                <span className="text-[10px] bg-zinc-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">AR Kit</span>
                            </div>

                            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">
                                Seamlessly integrated with USDZ and GLB
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium">{label}</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}
