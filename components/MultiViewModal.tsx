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

    const handleRemove = (type: string) => {
        setSelections(prev => {
            const next = { ...prev };
            delete next[type];
            return next;
        });
    };

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
                        className="absolute inset-0 bg-zinc-950/95 backdrop-blur-3xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative bg-[#080808] w-full max-w-4xl rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,1)] border border-white/5 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Spatial Mapping Console</h3>
                                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Assign perspectives for high-fidelity sculpting</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10 group">
                                <X className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Content Area - Grid-based for absolute stability and zero overlap */}
                        <div className="flex-grow flex items-center justify-center p-6 md:p-10 select-none overflow-hidden">
                            <div className="grid grid-cols-3 gap-y-4 gap-x-12 md:gap-x-20 items-center justify-items-center w-full max-w-3xl mx-auto py-4">

                                {/* Row 1: Top Control */}
                                <div className="col-start-2">
                                    <SlotView slot={VIEW_SLOTS[0]} data={selections['top']} onChange={(f) => handleFileChange('top', f)} onRemove={() => handleRemove('top')} />
                                </div>

                                {/* Row 2: 45 Degree Angles */}
                                <div className="col-start-1">
                                    <SlotView slot={VIEW_SLOTS[1]} data={selections['left_front']} onChange={(f) => handleFileChange('left_front', f)} onRemove={() => handleRemove('left_front')} />
                                </div>
                                <div className="col-start-3">
                                    <SlotView slot={VIEW_SLOTS[3]} data={selections['right_front']} onChange={(f) => handleFileChange('right_front', f)} onRemove={() => handleRemove('right_front')} />
                                </div>

                                {/* Row 3: Profiles & Hub */}
                                <div className="col-start-1">
                                    <SlotView slot={VIEW_SLOTS[4]} data={selections['left']} onChange={(f) => handleFileChange('left', f)} onRemove={() => handleRemove('left')} />
                                </div>
                                <div className="col-start-2 relative">
                                    {/* Central Technical Preview */}
                                    <div className="w-44 h-44 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-xl flex items-center justify-center relative group overflow-hidden shadow-inner">
                                        <div className="absolute inset-0 border border-white/[0.02] rounded-full animate-spin-slow" />
                                        {selections['front'] ? (
                                            <Image src={selections['front'].base64} alt="Preview" fill className="object-contain p-8" />
                                        ) : (
                                            <Camera className="w-8 h-8 text-zinc-800" />
                                        )}
                                    </div>
                                </div>
                                <div className="col-start-3">
                                    <SlotView slot={VIEW_SLOTS[5]} data={selections['right']} onChange={(f) => handleFileChange('right', f)} onRemove={() => handleRemove('right')} />
                                </div>

                                {/* Row 4: Front & Back Logic (Spread apart) */}
                                <div className="col-start-1">
                                    <SlotView slot={VIEW_SLOTS[2]} data={selections['front']} onChange={(f) => handleFileChange('front', f)} onRemove={() => handleRemove('front')} required />
                                </div>
                                <div className="col-start-3">
                                    <SlotView slot={VIEW_SLOTS[6]} data={selections['back']} onChange={(f) => handleFileChange('back', f)} onRemove={() => handleRemove('back')} />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-10 py-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">{Object.keys(selections).length} Views Active</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-4 bg-zinc-900/50 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={Object.keys(selections).length < 2}
                                    onClick={handleConfirm}
                                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${Object.keys(selections).length >= 2 ? 'bg-accent text-white shadow-2xl shadow-accent/20 hover:scale-[1.02]' : 'bg-zinc-900/10 text-zinc-800 cursor-not-allowed border border-white/[0.02]'
                                        }`}
                                >
                                    Confirm Synergy
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function SlotView({ slot, data, onChange, onRemove, required }: {
    slot: ViewSlot,
    data?: { base64: string },
    onChange: (file: File) => void,
    onRemove?: () => void,
    required?: boolean
}) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="relative group">
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-28 h-28 md:w-32 md:h-32 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer relative overflow-hidden ${data ? 'border-accent bg-accent/10 shadow-lg shadow-accent/5' : 'border-white/[0.03] bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
                />

                {data ? (
                    <div className="absolute inset-0 animate-fade-in group-hover:scale-105 transition-transform duration-500">
                        <Image src={data.base64} alt={slot.label} fill className="object-cover" />
                        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <Upload className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-white/5 rounded-xl mb-2 flex items-center justify-center text-zinc-600 group-hover:text-accent transition-all group-hover:scale-110">
                            {slot.icon}
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-[0.1em] text-zinc-600 group-hover:text-white transition-colors">{slot.label}</p>
                        {required && (
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                                <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Float Controls */}
            {data && onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white text-zinc-950 rounded-full flex items-center justify-center shadow-xl z-20 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-zinc-200"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
