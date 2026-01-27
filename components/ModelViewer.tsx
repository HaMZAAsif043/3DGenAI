'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

interface ModelViewerProps {
    modelUrl: string | null;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
    if (!modelUrl) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                <div className="text-zinc-400 text-center">
                    <p className="text-lg font-medium">Model Preview</p>
                    <p className="text-sm">Generate a model to see it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[500px] bg-zinc-50 rounded-3xl overflow-hidden relative border border-zinc-200">
            <Canvas shadows camera={{ position: [4, 4, 4], fov: 45 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6} contactShadows={false}>
                        <Center>
                            <Model url={modelUrl} />
                        </Center>
                    </Stage>
                    <ContactShadows
                        position={[0, -0.8, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={0.8}
                    />
                    <Environment preset="city" />
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
            </Canvas>

            <div className="absolute bottom-6 left-6 flex gap-2">
                <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold border border-zinc-200">
                    Orbit Controls Active
                </div>
                <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold border border-zinc-200">
                    Auto Height: Enabled
                </div>
            </div>
        </div>
    );
}
// Preload to avoid jitter
// useGLTF.preload('/path-to-default-model.glb');
