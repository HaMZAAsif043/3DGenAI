'use client'
import { OrbitControls, useGLTF, Environment, ContactShadows, Center, PerformanceMonitor, Bounds, useBounds } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AlertCircle, Download, Loader2, Maximize2 } from 'lucide-react';
import * as THREE from 'three';
import ZipLoader from './ZipLoader';
import React, { useState, useEffect, useMemo, Suspense } from "react"
function Model({ url, object }: { url?: string; object?: THREE.Group; onError: (err: any) => void }) {
    const bounds = useBounds();
    const { scene } = useGLTF(url || '', true);

    useEffect(() => {
        if (object || (url && scene)) {
            const timer = setTimeout(() => bounds.refresh().clip().fit(), 100);
            return () => clearTimeout(timer);
        }
    }, [url, object, bounds, scene]);

    if (object) return <primitive object={object} />;
    return <primitive object={scene} />;
}

interface ModelViewerProps {
    modelUrl: string | null;
    groupRef?: React.RefObject<THREE.Group | null>;
}

export default function ModelViewer({ modelUrl, groupRef }: ModelViewerProps) {
    const [error, setError] = useState<boolean>(false);
    const [zipObject, setZipObject] = useState<THREE.Group | null>(null);
    const [dpr, setDpr] = useState(1.5);

    const isZip = useMemo(() => {
        if (!modelUrl) return false;
        try {
            const urlLower = modelUrl.toLowerCase();
            // Check if URL itself contains .zip or if 'url' parameter does
            if (urlLower.includes('.zip')) return true;

            const params = new URLSearchParams(modelUrl.split('?')[1]);
            const originalUrl = params.get('url') || '';
            return originalUrl.toLowerCase().includes('.zip');
        } catch {
            return false;
        }
    }, [modelUrl]);

    // Reset states when URL changes
    useEffect(() => {
        setError(false);
        setZipObject(null);
    }, [modelUrl]);

    if (!modelUrl || error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 p-8 text-center ring-1 ring-zinc-100 ring-inset">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
                    <AlertCircle className="w-8 h-8 text-zinc-300" />
                </div>
                <div className="text-zinc-600">
                    <p className="text-lg font-bold">
                        {error ? "Unable to Load Preview" : "Model Preview"}
                    </p>
                    <p className="text-sm mt-2 max-w-[250px] mx-auto opacity-70">
                        {error ? "There was a problem loading the 3D preview. You can still download the model below." :
                            "Generate a model to see it here"}
                    </p>
                </div>
            </div>
        );
    }

    if (isZip && !zipObject) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-zinc-200 p-8 text-center shadow-lg shadow-zinc-100/50">
                <ZipLoader
                    url={modelUrl}
                    onLoad={(obj) => {
                        setZipObject(obj);
                    }}
                    onError={() => {
                        setError(true);
                    }}
                />
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-white rounded-3xl border border-zinc-100 shadow-xl flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    </div>
                </div>
                <div className="text-zinc-600">
                    <p className="text-xl font-bold bg-gradient-to-br from-zinc-900 to-zinc-500 bg-clip-text text-transparent">Extracting Assets...</p>
                    <div className="mt-4 flex flex-col items-center gap-2">
                        <div className="w-48 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-accent animate-progress" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Processing OBJ + MTL</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[550px] bg-white rounded-3xl overflow-hidden relative border border-zinc-200 shadow-inner">
            <Canvas
                shadows
                dpr={dpr}
                camera={{ position: [3, 3, 3], fov: 30 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            >
                <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
                <Suspense fallback={null}>
                    {/* Lighting Rig */}
                    <ambientLight intensity={1.0} />
                    <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
                    <directionalLight position={[-5, 5, 5]} intensity={1.2} />
                    <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffffff" />

                    <Bounds fit clip observe margin={1.2}>
                        <Center top ref={groupRef as any}>
                            {zipObject ? (
                                <primitive object={zipObject} />
                            ) : modelUrl ? (
                                <ErrorBoundary onError={() => setError(true)}>
                                    <Model url={modelUrl} onError={() => setError(true)} />
                                </ErrorBoundary>
                            ) : null}
                        </Center>
                    </Bounds>

                    <ContactShadows
                        position={[0, -0.01, 0]}
                        opacity={0.6}
                        scale={10}
                        blur={2.5}
                        far={4}
                    />
                    <Environment preset="studio" environmentIntensity={1} />
                </Suspense>
                <OrbitControls
                    makeDefault
                    autoRotate
                    autoRotateSpeed={1}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.75}
                    enableDamping
                />
            </Canvas>

            {/* Premium Overlay */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Environment</p>
                    <p className="text-xs font-bold text-zinc-800">Studio Pro v2</p>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-2">
                <div className="px-3 py-1 bg-zinc-900/90 text-white backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl border border-white/10">
                    High Poly Render
                </div>
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200" />
                    ))}
                </div>
                <p className="text-[10px] font-medium text-zinc-400">Visualizing 4 assets</p>
            </div>
        </div>
    );
}
// Preload to avoid jitter
// useGLTF.preload('/path-to-default-model.glb');

class ErrorBoundary extends React.Component<{ children: React.ReactNode; onError: () => void }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any) {
        console.error("Model Viewer Error Caught:", error);
        this.props.onError();
    }

    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}
