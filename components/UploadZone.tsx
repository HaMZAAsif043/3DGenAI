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
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px]
          ${isDragActive ? 'border-accent bg-accent/5' : 'border-zinc-200 hover:border-zinc-400'}`}
            >
                <input {...getInputProps()} />

                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <Upload className={`w-8 h-8 ${isDragActive ? 'text-accent' : 'text-zinc-400'}`} />
                </div>

                <h3 className="text-xl font-bold mb-2">
                    {isDragActive ? 'Drop your images here' : 'Select images to generate 3D'}
                </h3>
                <p className="text-zinc-500 text-center max-w-sm">
                    Drag & drop JPG or PNG files here. Support for single or multi-view snapshots.
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-8 flex flex-col gap-6 w-full"
                >
                    {/* Premium Credit Card */}
                    <div className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center justify-between p-6 bg-zinc-950 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full -mr-16 -mt-16" />

                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                    <AlertCircle className="w-7 h-7 text-accent" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Compute Balance</p>
                                    <p className="text-xl font-bold text-white tracking-tight">200 Free Credits</p>
                                </div>
                            </div>

                            <div className="text-right relative z-10">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                    <p className="text-xs font-black text-accent uppercase tracking-widest">-25 / generation</p>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] bg-white/5 py-1 px-3 rounded-full border border-white/5">
                                    8 Cycles Remaining
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                                <div className="w-1 h-3 bg-accent rounded-full" />
                                Image Protocols
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Format Compatibility', value: 'JPG, PNG, WEBP' },
                                    { label: 'Pixel Density', value: '128px - 5000px' },
                                    { label: 'Payload Limit', value: '6MB (Base64)' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{item.label}</span>
                                        <span className="text-[10px] font-black text-zinc-950 uppercase tracking-widest">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-zinc-50/50 rounded-[2rem] border border-dashed border-zinc-200 group hover:border-accent/30 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
                                {/* <Sparkles className="w-3 h-3 text-accent" /> */}
                                Optimization Tips
                            </h4>
                            <p className="text-[11px] leading-relaxed text-zinc-600 font-medium">
                                Leverage <span className="text-zinc-950 font-bold">Multi-view (up to 5 images)</span> for high-fidelity sculpting. Neutral lighting and plain backgrounds yield superior vertex precision.
                            </p>
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
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity btn-hover-effect cursor-pointer"
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
