'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface UploadZoneProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
}

export default function UploadZone({ onFilesSelected, maxFiles = 5 }: UploadZoneProps) {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    }, [files, maxFiles, onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        maxFiles
    });

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    };

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-6 xs:p-8 md:p-10 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px]
          ${isDragActive ? 'border-accent bg-accent/5' : 'border-zinc-200 hover:border-zinc-400'}`}
            >
                <input {...getInputProps()} />

                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className={`w-6 h-6 ${isDragActive ? 'text-accent' : 'text-zinc-400'}`} />
                </div>

                <h3 className="text-lg font-bold mb-1">
                    {isDragActive ? 'Drop your images here' : 'Select images to generate 3D'}
                </h3>
                <p className="text-zinc-500 text-center max-w-sm text-sm">
                    Drag & drop JPG or PNG files here. Support for single or multi-view snapshots.
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 flex flex-col gap-4 w-full"
                >
                    {/* Premium Credit Card - Compact */}
                    <div className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex flex-col xs:flex-row items-center justify-between p-5 bg-zinc-950 rounded-[1.5rem] border border-white/5 shadow-2xl overflow-hidden gap-4">
                            <div className="flex flex-row items-center gap-3 relative z-10">
                                <div className="shrink-0 w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                                    <AlertCircle className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">Balance</p>
                                    <p className="text-sm font-bold text-white tracking-tight">200 Credits</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center xs:items-end relative z-10 shrink-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                                    <p className="text-[9px] font-black text-accent uppercase tracking-widest whitespace-nowrap">-25 / generation</p>
                                </div>
                                <div className="inline-block bg-white/5 py-1 px-3 rounded-full border border-white/5">
                                    <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                        8 Cycles Remaining
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines - Compact Vertical */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="p-4 bg-white rounded-[1.5rem] border border-zinc-100 shadow-sm min-w-0">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-4 flex items-center gap-2">
                                <div className="w-1 h-2 bg-accent rounded-full" />
                                Image Protocols
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Format', value: 'JPG, PNG, WEBP' },
                                    { label: 'Resolution', value: '128px - 5000px' },
                                    { label: 'Limit', value: '6MB' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center justify-between gap-4 pb-2 border-b border-zinc-50 last:border-0 last:pb-0">
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">{item.label}</span>
                                        <span className="text-[9px] font-black text-zinc-950 uppercase tracking-widest">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-4 bg-zinc-50/50 rounded-[1.5rem] border border-dashed border-zinc-200 min-w-0">
                            <div className="space-y-3">
                                <p className="text-[10px] leading-relaxed text-zinc-600 font-medium">
                                    Use <span className="text-zinc-950 font-bold">Multi-view</span> (max 5) for better precision.
                                </p>
                                <div className="p-3 bg-white rounded-xl border border-zinc-100/50 text-[9px] text-zinc-500 leading-relaxed font-medium">
                                    <span className="text-accent font-bold">PRO TIP:</span> Plain backgrounds reduce noise.
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                    >
                        {files.map((file, idx) => (
                            <motion.div
                                key={file.name + idx}
                                layout
                                className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200"
                            >
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
