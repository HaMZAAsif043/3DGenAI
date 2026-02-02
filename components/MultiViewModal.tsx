'use client';

import React, { useState } from 'react';
import { X, Upload, Camera, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ViewSlot {
    type: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'left_front' | 'right_front';
    label: string;
    description: string;
    icon: React.ReactNode;
}

const VIEW_SLOTS: ViewSlot[] = [
    { type: 'top', label: 'Top View', description: 'Bird\'s eye perspective', icon: <Camera className="w-4 h-4" /> },
    { type: 'left_front', label: '45° Left', description: 'Front-left angle', icon: <Camera className="w-4 h-4" /> },
    { type: 'front', label: 'Correct Image', description: 'Central front view', icon: <Camera className="w-4 h-4" /> },
    { type: 'right_front', label: '45° Right', description: 'Front-right angle', icon: <Camera className="w-4 h-4" /> },
    { type: 'left', label: 'Left View', description: 'Direct left profile', icon: <Camera className="w-4 h-4" /> },
    { type: 'right', label: 'Right View', description: 'Direct right profile', icon: <Camera className="w-4 h-4" /> },
    { type: 'back', label: 'Back View', description: 'Rear perspective', icon: <Camera className="w-4 h-4" /> },
];

interface MultiViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (views: { type: string; file: File; base64: string }[]) => void;
    mainImage?: { file: File; base64: string };
}

export default function MultiViewModal({ isOpen, onClose, onComplete, mainImage }: MultiViewModalProps) {
    const [selections, setSelections] = useState<Record<string, { file: File; base64: string }>>({});

    // Initialize with main image if provided
    React.useEffect(() => {
        if (mainImage && !selections['front']) {
            setSelections(prev => ({ ...prev, front: mainImage }));
        }
    }, [mainImage]);

    const handleFileChange = (type: string, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setSelections(prev => ({
                ...prev,
                [type]: { file, base64: reader.result as string }
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = () => {
        const results = Object.entries(selections).map(([type, data]) => ({
            type,
            ...data
        }));
        onComplete(results);
    };

    const isReady = Object.keys(selections).length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative bg-[#1a1a1a] w-full max-w-4xl rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Add Multiple Views</h3>
                                <p className="text-zinc-500 text-xs font-medium mt-1">Spatially map your object for high-fidelity reconstruction.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-8 md:p-12">
                            <div className="relative max-w-2xl mx-auto aspect-square md:aspect-video flex items-center justify-center">
                                {/* The Central Whale (Preview) */}
                                <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20 pointer-events-none">
                                    {selections['front'] ? (
                                        <div className="relative w-64 h-64 grayscale blur-sm scale-110 transition-all duration-700">
                                            <Image src={selections['front'].base64} alt="Reference" fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                                            <Camera className="w-12 h-12 text-white/10" />
                                        </div>
                                    )}
                                </div>

                                {/* Slot Grid - Following the mockup layout */}
                                <div className="grid grid-cols-3 gap-6 relative z-10">
                                    {/* Row 1: Top */}
                                    <div className="col-start-2 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[0]} // top
                                            data={selections['top']}
                                            onChange={(f) => handleFileChange('top', f)}
                                        />
                                    </div>

                                    {/* Row 2: Left 45, Front, Right 45 */}
                                    <div className="col-start-1 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[1]} // left_front
                                            data={selections['left_front']}
                                            onChange={(f) => handleFileChange('left_front', f)}
                                        />
                                    </div>
                                    <div className="col-start-2 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[2]} // front
                                            data={selections['front']}
                                            onChange={(f) => handleFileChange('front', f)}
                                            required
                                        />
                                    </div>
                                    <div className="col-start-3 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[3]} // right_front
                                            data={selections['right_front']}
                                            onChange={(f) => handleFileChange('right_front', f)}
                                        />
                                    </div>

                                    {/* Row 3: Left, Right (Whale in center is implied/visual) */}
                                    <div className="col-start-1 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[4]} // left
                                            data={selections['left']}
                                            onChange={(f) => handleFileChange('left', f)}
                                        />
                                    </div>
                                    <div className="col-start-3 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[5]} // right
                                            data={selections['right']}
                                            onChange={(f) => handleFileChange('right', f)}
                                        />
                                    </div>

                                    {/* Row 4: Back */}
                                    <div className="col-start-2 flex justify-center">
                                        <SlotView
                                            slot={VIEW_SLOTS[6]} // back
                                            data={selections['back']}
                                            onChange={(f) => handleFileChange('back', f)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-accent" />
                                </div>
                                <span>{Object.keys(selections).length} Views Mapped</span>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-mono"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={Object.keys(selections).length < 2}
                                    onClick={handleConfirm}
                                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${Object.keys(selections).length >= 2 ? 'bg-accent text-white shadow-xl shadow-accent/20 hover:scale-105' : 'bg-zinc-800 text-zinc-500 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    Initiate Multi-View Generation
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function SlotView({ slot, data, onChange, required }: { slot: ViewSlot, data?: { base64: string }, onChange: (file: File) => void, required?: boolean }) {
    return (
        <label className={`w-36 h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer relative group overflow-hidden ${data ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}>
            <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
            />

            {data ? (
                <div className="absolute inset-0 animate-fade-in">
                    <Image src={data.base64} alt={slot.label} fill className="object-cover" />
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-10 h-10 bg-white/5 rounded-xl mb-3 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        {slot.icon}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{slot.label} {required && <span className="text-accent">*</span>}</p>
                </>
            )}
        </label>
    );
}
