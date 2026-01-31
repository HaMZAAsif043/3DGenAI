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
import { exportToGLB, exportToUSDZ, triggerDownload } from '@/lib/exporters';

type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export default function UploadPage() {
    const [status, setStatus] = useState<JobStatus>('idle');
    const [jobId, setJobId] = useState<string | null>(null);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showQR, setShowQR] = useState(false);
    const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
    const [isExporting, setIsExporting] = useState<'glb' | 'usdz' | null>(null);
    const [generationMode, setGenerationMode] = useState<'pro' | 'rapid'>('pro');
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const modelGroupRef = useRef<THREE.Group>(null);

    // Persistence: Restore Job ID on mount
    useEffect(() => {
        let savedJob = localStorage.getItem('last_hunyuan_job_id');

        // Manual seed for the specific job requested by user
        if (!savedJob || savedJob === "1408773166930632704") {
            savedJob = "demo-jacket-1";
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

                    if (data.error || data.Status === 'FAILED') {
                        setStatus('failed');
                        setErrorMessage(data.error || data.ErrorMsg || 'Generation failed');
                        localStorage.removeItem('last_hunyuan_job_id');
                        clearInterval(interval);
                    } else if (data.Status === 'SUCCESS') {
                        setStatus('completed');
                        setModelUrl(data.ResultUrl);
                        localStorage.removeItem('last_hunyuan_job_id');
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

    const handleStartGeneration = async (files?: File[]) => {
        const filesToUpload = files || pendingFiles;
        if (filesToUpload.length === 0) return;

        setUploadedFilesCount(filesToUpload.length);
        setStatus('uploading');
        setErrorMessage(null);
        setShareUrl(null);
        setShowQR(false);
        setPendingFiles([]); // Clear pending state
        setProgress(20);

        try {
            // Compress and process all selected files to base64
            const processedImages = await Promise.all(
                filesToUpload.map(async file => {
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

    const handleStartDemo = (modelId: string, glbUrl: string) => {
        setStatus('uploading');
        setErrorMessage(null);
        setProgress(30);

        setTimeout(() => {
            setStatus('processing');
            setProgress(60);

            setTimeout(() => {
                setStatus('completed');
                setModelUrl(glbUrl);
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
        console.log("SHARE_UPV6: handleShareAR called", { jobId, modelUrl });

        // 1. Jacket Detection
        const isJacket = jobId?.includes('jacket') ||
            modelUrl?.includes('jacket.glb') ||
            jobId === "1408773166930632704" ||
            jobId === "1408803058363703296";

        if (isJacket) {
            const usdzUrl = "https://iteijaqdlduvfybamemk.supabase.co/storage/v1/object/public/3D%20assets/jacket.usdz";
            console.log("SHARE_UPV6: Jacket detected, using Supabase USDZ link.");
            setShareUrl(usdzUrl);
            setShowQR(true);
            return;
        }

        // 2. Fallback for Generated Models - Use the direct model link
        if (modelUrl) {
            console.log("SHARE_UPV6: Using direct model link for QR.");
            // If it's a proxy link, try to get the original or just use it as is
            setShareUrl(modelUrl.startsWith('http') ? modelUrl : `${window.location.origin}${modelUrl}`);
            setShowQR(true);
        } else {
            setErrorMessage('Model not ready for sharing');
        }
    };

    return (
        <div className="min-h-screen pt-8 pb-20 px-4 md:px-12 2xl:px-24 space-y-12 animate-fade-in relative overflow-hidden max-w-[1920px] mx-auto">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full -z-10 animate-pulse-subtle" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-400/5 blur-[100px] rounded-full -z-10" />

            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 text-zinc-950 uppercase">
                        Materialize Asset
                    </h1>
                    <p className="text-zinc-500 text-lg font-medium">Turn vision into production-ready 3D vertex data.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-50 text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-100 shadow-sm">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Next-Gen Engine v2.0
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-10 2xl:gap-20 items-start">
                {/* Left Column: Input */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 relative overflow-hidden group border border-zinc-100">
                        <div className="relative z-10">
                            <UploadZone onFilesSelected={(files) => {
                                if (status === 'idle' || status === 'completed' || status === 'failed') {
                                    setPendingFiles(Array.from(files));
                                    setStatus('idle');
                                    setErrorMessage(null);
                                }
                            }} />

                            {uploadedFilesCount > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex items-center gap-3 p-4 bg-blue-50/80 backdrop-blur-md text-blue-700 rounded-2xl border border-blue-100 text-sm font-bold"
                                >
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    Multi-view Synergy: Optimized {uploadedFilesCount} views
                                </motion.div>
                            )}

                            <div className="mt-10 pt-8 border-t border-zinc-50">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-1">Engine Configuration</h4>
                                <button
                                    onClick={() => setGenerationMode(generationMode === 'pro' ? 'rapid' : 'pro')}
                                    className="w-full flex items-center justify-between p-5 bg-zinc-50/50 rounded-3xl border border-zinc-100 hover:border-accent/30 hover:bg-white hover:shadow-xl transition-all group btn-hover-effect cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center transition-transform group-hover:rotate-6 font-black">
                                            {generationMode === 'pro' ? 'HQ' : 'FT'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900">{generationMode === 'pro' ? 'Hunyuan3D Professional' : 'Rapid Draft'}</p>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {generationMode === 'pro' ? 'Studio Quality • 180s' : 'Speed Optimized • 45s'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-14 h-7 rounded-full relative transition-colors duration-500 ${generationMode === 'pro' ? 'bg-accent' : 'bg-zinc-200'}`}>
                                        <motion.div
                                            animate={{ x: generationMode === 'pro' ? 28 : 4 }}
                                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                                        />
                                    </div>
                                </button>
                            </div>

                            {/* Demo Models Selection */}
                            <div className="mt-10 pt-8 border-t border-zinc-50">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-1">Trial Inspirations</h4>
                                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-4">
                                    {DemoOptions.slice(0, 8).map((option, idx) => (
                                        <motion.button
                                            key={option.currentModel.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => handleStartDemo(
                                                option.currentModel.id,
                                                option.glbModel || option.image
                                            )}
                                            className="group relative aspect-square rounded-[1.25rem] overflow-hidden border-2 border-transparent hover:border-accent transition-all bg-zinc-50 shadow-sm cursor-pointer"
                                        >
                                            <img
                                                src={option.image}
                                                alt={option.label}
                                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <p className="text-[9px] text-zinc-950 font-black uppercase tracking-widest px-2 text-center leading-tight">{option.label}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Viewer */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="h-[600px] sticky top-8 bg-zinc-50 rounded-[3rem] shadow-2xl shadow-zinc-200/50 overflow-hidden border border-zinc-100 group">
                        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-zinc-600 border border-zinc-100 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Live WebGL Rendering
                        </div>

                        {status === 'processing' || status === 'uploading' ? (
                            <div className="h-full w-full flex flex-col items-center justify-center p-10 text-center">
                                <ModelSkeleton />
                                <div className="mt-8">
                                    <p className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Processing Vertex Data</p>
                                    <div className="w-48 h-1 bg-zinc-200 rounded-full mt-3 overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-192, 192] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                            className="w-full h-full bg-accent"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <ModelViewer modelUrl={modelUrl} groupRef={modelGroupRef} />
                        )}
                    </div>

                    {pendingFiles.length > 0 && status === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-6 bg-accent/5 rounded-[2.5rem] border border-accent/20"
                        >
                            <button
                                onClick={() => handleStartGeneration()}
                                className="w-full py-6 bg-zinc-950 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all btn-hover-effect cursor-pointer group shadow-xl shadow-zinc-200"
                            >
                                Initiate Generation
                                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </button>
                            <p className="text-center text-[10px] font-black text-accent/60 uppercase tracking-[0.3em] mt-4">
                                Ready to materialize {pendingFiles.length} assets
                            </p>
                        </motion.div>
                    )}

                    {/* Status Tracker */}
                    <AnimatePresence mode="wait">
                        {status !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-8 rounded-[2.5rem] border shadow-2xl ${status === 'failed' ? 'bg-red-50 border-red-100 text-red-900' :
                                    status === 'completed' ? 'bg-white border-zinc-100 text-zinc-950' :
                                        'bg-zinc-950 text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        {status === 'completed' ? (
                                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                                                <CheckCircle2 className="w-7 h-7" />
                                            </div>
                                        ) : status === 'failed' ? (
                                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                                                <AlertCircle className="w-7 h-7" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/40">
                                                <Loader2 className="w-7 h-7 animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <p className="text-xl font-black tracking-tight uppercase">
                                            {status === 'uploading' && 'Ingesting Assets'}
                                            {status === 'processing' && 'Neural Sculpting'}
                                            {status === 'completed' && 'Topology Ready'}
                                            {status === 'failed' && 'Process Halt'}
                                        </p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${status === 'processing' || status === 'uploading' ? 'text-zinc-500' : 'opacity-60'}`}>
                                            {status === 'processing' && 'Deployment: Est. 2 mins'}
                                            {status === 'completed' && 'Production grade mesh verified.'}
                                            {status === 'failed' && errorMessage}
                                        </p>
                                    </div>
                                </div>

                                {status === 'completed' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-10 pt-8 border-t border-zinc-50 grid grid-cols-2 gap-4"
                                    >
                                        <button
                                            onClick={() => downloadModel('glb')}
                                            disabled={!!isExporting}
                                            className="flex items-center justify-center gap-3 py-5 bg-zinc-950 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-black transition-all btn-hover-effect cursor-pointer"
                                        >
                                            {isExporting === 'glb' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                            Export GLB
                                        </button>
                                        <button
                                            onClick={() => downloadModel('usdz')}
                                            disabled={!!isExporting}
                                            className="flex items-center justify-center gap-3 py-5 bg-white text-zinc-950 border border-zinc-100 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 transition-all btn-hover-effect cursor-pointer"
                                        >
                                            {isExporting === 'usdz' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                                            Export USDZ
                                        </button>
                                        <button
                                            onClick={handleShareAR}
                                            className="col-span-2 flex items-center justify-center gap-3 py-5 bg-accent text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl shadow-accent/30 hover:shadow-accent/40 transition-all btn-hover-effect cursor-pointer"
                                        >
                                            <QrCode className="w-4 h-4" />
                                            Launch Space AR
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQR(false)}
                            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full text-center border border-zinc-100"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-6 right-6 p-2 bg-zinc-50 hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
                            >
                                <CloseX className="w-5 h-5 text-zinc-400" />
                            </button>

                            <div className="mb-10">
                                <div className="w-20 h-20 bg-accent text-white shadow-2xl shadow-accent/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                    <Smartphone className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Step into AR</h3>
                                <p className="text-zinc-500 font-medium mt-2">Materialize this asset in your physical space.</p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 mb-10 flex justify-center">
                                <QRCodeSVG value={shareUrl || `${window.location.origin}/ar/${jobId}`} size={240} includeMargin />
                            </div>

                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                                Universal Platform Compatibility <br /> (Apple QuickLook & SceneViewer)
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
