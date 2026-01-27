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

                <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400 border border-zinc-100 px-4 py-2 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    Max {maxFiles} images recommended for best results
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
