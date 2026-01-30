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

                <div className="mt-8 flex flex-col gap-4 w-full">
                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">Total Credits</p>
                                <p className="font-semibold text-zinc-900">200 Free Credits</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-accent">-25 / gen</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">8 Uses Total</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Image Guidelines</h4>
                            <ul className="text-xs text-zinc-600 space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-accent rounded-full" />
                                    Formats: JPG, PNG, WEBP
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-accent rounded-full" />
                                    Resolution: 128px to 5000px
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-accent rounded-full" />
                                    Size: Max 6MB (Base64)
                                </li>
                            </ul>
                        </div>
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Pro Tips</h4>
                            <p className="text-[10px] leading-relaxed text-zinc-500">
                                For best results, use a plain background and ensure the object is centered.
                                Multi-view (up to 5 images) creates significantly more detailed models.
                            </p>
                        </div>
                    </div>
                </div>
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
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
