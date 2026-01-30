'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Sparkles, Loader2, CheckCircle2, AlertCircle, Download, Smartphone, QrCode, X as CloseX, Layers, ArrowUpRight } from 'lucide-react';
import UploadZone from '@/components/UploadZone';
import ModelViewer from '@/components/ModelViewer';
import ModelSkeleton from '@/components/ModelSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Options as DemoOptions } from '@/lib/demo-data';
import * as THREE from 'three';
import { exportToGLB, exportToUSDZ, uploadToCloudinary, triggerDownload } from '@/lib/exporters';

type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export default function UploadPage() {
    const [status, setStatus] = useState<JobStatus>('idle');
    const [jobId, setJobId] = useState<string | null>(null);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showQR, setShowQR] = useState(false);
    const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
    const [isExporting, setIsExporting] = useState<'glb' | 'usdz' | null>(null);
    const [generationMode, setGenerationMode] = useState<'pro' | 'rapid'>('pro');
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
    const modelGroupRef = useRef<THREE.Group>(null);

    // Persistence: Restore Job ID on mount
    useEffect(() => {
        let savedJob = localStorage.getItem('last_hunyuan_job_id');

        // Manual seed for the specific job requested by user
        if (!savedJob) {
            savedJob = "1408773166930632704";
            localStorage.setItem('last_hunyuan_job_id', savedJob);
        }

        if (savedJob && !jobId) {
            setJobId(savedJob);
            setStatus('processing'); // Resume polling
        }
    }, []);

    // Poll status when processing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'processing' && jobId) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/status/${jobId}?mode=${generationMode}`);
                    const data = await res.json();

                    if (data.Status === 'SUCCESS') {
                        setStatus('completed');
                        setModelUrl(data.ResultUrl);
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

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1200; // Optimal for Tencent API

                    if (width > height) {
                        if (width > maxDim) {
                            height *= maxDim / width;
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width *= maxDim / height;
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                            } else {
                                reject(new Error('Compression failed'));
                            }
                        },
                        'image/jpeg',
                        0.85
                    );
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleStartGeneration = async (files: File[]) => {
        if (files.length === 0) return;

        setUploadedFilesCount(files.length);
        setStatus('uploading');
        setErrorMessage(null);
        setProgress(20);

        try {
            // Compress and process all selected files to base64
            const processedImages = await Promise.all(
                files.map(async file => {
                    const compressed = await compressImage(file);
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(compressed);
                    });
                })
            );

            setProgress(40);
            setStatus('processing');

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: processedImages, mode: generationMode }),
            });

            const data = await res.json();
            if (data.jobId) {
                setJobId(data.jobId);
                localStorage.setItem('last_hunyuan_job_id', data.jobId);
                setProgress(60);
            } else {
                throw new Error(data.error || 'Failed to start job');
            }
        } catch (err) {
            const error = err as Error;
            setStatus('failed');
            setErrorMessage(error.message);
        }
    };

    const handleStartDemo = (modelId: string, url: string) => {
        setStatus('uploading');
        setErrorMessage(null);
        setProgress(30);

        setTimeout(() => {
            setStatus('processing');
            setProgress(60);

            setTimeout(() => {
                setStatus('completed');
                setModelUrl(url);
                setJobId(`demo-${modelId}`);
                setProgress(100);
            }, 2000);
        }, 1500);
    };

    const downloadModel = async (format: 'glb' | 'usdz') => {
        if (!modelGroupRef.current) {
            console.error('No model group found for export');
            return;
        }

        try {
            setIsExporting(format);
            if (format === 'glb') {
                const blob = await exportToGLB(modelGroupRef.current);
                triggerDownload(blob, `model-${Date.now()}.glb`);
            } else {
                const blob = await exportToUSDZ(modelGroupRef.current);
                triggerDownload(blob, `model-${Date.now()}.usdz`);
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

            // 1. Export scene to USDZ blob
            const usdzBlob = await exportToUSDZ(modelGroupRef.current);

            // 2. Upload to Cloudinary to get a permanent URL for the QR code
            const fileName = `model-${jobId || Date.now()}.usdz`;
            const url = await uploadToCloudinary(usdzBlob, fileName);

            setCloudinaryUrl(url);
            setShowQR(true);
        } catch (err) {
            console.error('AR Export/Upload failed:', err);
            setErrorMessage('Failed to prepare AR sharing');
        } finally {
            setIsExporting(null);
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
                            if (status === 'idle' || status === 'completed' || status === 'failed') {
                                handleStartGeneration(files);
                            }
                        }} />

                        {uploadedFilesCount > 1 && (
                            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-sm font-medium animate-in fade-in slide-in-from-top-4">
                                <Layers className="w-4 h-4" />
                                Multi-view Mode: Merging {uploadedFilesCount} images for higher fidelity
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Generation Mode</h4>
                            <button
                                onClick={() => setGenerationMode(generationMode === 'pro' ? 'rapid' : 'pro')}
                                className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-accent/20 transition-all group"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <Sparkles className={`w-5 h-5 ${generationMode === 'pro' ? 'text-accent' : 'text-zinc-400'}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{generationMode === 'pro' ? 'Hunyuan3D Pro' : 'Hunyuan3D Rapid'}</p>
                                        <p className="text-xs text-zinc-500">
                                            {generationMode === 'pro' ? 'Highest fidelity (2-3 mins)' : 'Faster results (30-60 secs)'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${generationMode === 'pro' ? 'bg-accent' : 'bg-zinc-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${generationMode === 'pro' ? 'right-1' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>

                        {/* Demo Models Selection */}
                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Try Demo Models</h4>
                            <div className="grid grid-cols-4 gap-3">
                                {DemoOptions.slice(0, 8).map((option) => (
                                    <button
                                        key={option.currentModel.id}
                                        onClick={() => handleStartDemo(option.currentModel.id, (option as any).glbModel || option.image)}
                                        className="group relative aspect-square rounded-2xl overflow-hidden border border-zinc-100 hover:border-accent/50 transition-colors bg-zinc-50"
                                    >

                                        <img
                                            src={option.image}
                                            alt={option.label}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-[10px] text-white font-bold uppercase tracking-widest">{option.label}</p>
                                        </div>
                                    </button>
                                ))}
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

                                {status === 'completed' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3"
                                    >
                                        <button
                                            onClick={() => downloadModel('glb')}
                                            disabled={!!isExporting}
                                            className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50"
                                        >
                                            {isExporting === 'glb' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                            {isExporting === 'glb' ? 'Exporting...' : 'Download GLB'}
                                        </button>
                                        <button
                                            onClick={() => downloadModel('usdz')}
                                            disabled={!!isExporting}
                                            className="flex items-center justify-center gap-2 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors disabled:opacity-50"
                                        >
                                            {isExporting === 'usdz' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                                            {isExporting === 'usdz' ? 'Exporting...' : 'Download USDZ'}
                                        </button>
                                        <button
                                            onClick={handleShareAR}
                                            disabled={!!isExporting}
                                            className="col-span-2 flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                        >
                                            {isExporting === 'usdz' ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                                            {isExporting === 'usdz' ? 'Preparing AR...' : 'Share AR'}
                                        </button>
                                        <Link
                                            href={`/dashboard/viewer/${jobId}?mode=${generationMode}`}
                                            className="col-span-2 flex items-center justify-center gap-2 py-3 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                            Open Detailed Viewer
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* Right Column: Viewer */}
                <div className="space-y-6">
                    <div className="h-[500px] sticky top-8">

                        {status === 'processing' || status === 'uploading' ? (
                            <ModelSkeleton />
                        ) : (
                            <ModelViewer modelUrl={modelUrl} groupRef={modelGroupRef} />
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
                                <p className="text-zinc-500 text-sm mt-1">Scan to preview the 3D model in your physical space</p>
                                <div className="flex justify-center gap-4 mt-2">
                                    <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase tracking-widest">iOS: USDZ</span>
                                    <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase tracking-widest">Android: GLB</span>
                                </div>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mb-6 flex justify-center">
                                <QRCodeSVG value={cloudinaryUrl || `${window.location.origin}/ar/${jobId}`} size={200} />
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
