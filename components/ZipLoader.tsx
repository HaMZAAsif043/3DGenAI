'use client';

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import JSZip from 'jszip';

interface ZipLoaderProps {
    url: string;
    onLoad: (object: THREE.Group) => void;
    onError: (error: any) => void;
}

export default function ZipLoader({ url, onLoad, onError }: ZipLoaderProps) {
    useEffect(() => {
        const loadZip = async () => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);

                let objFile: JSZip.JSZipObject | null = null;
                let mtlFile: JSZip.JSZipObject | null = null;
                const textureFiles: Record<string, string> = {};

                // Find files in zip
                for (const [filename, file] of Object.entries(zip.files)) {
                    if (filename.toLowerCase().endsWith('.obj')) objFile = file;
                    if (filename.toLowerCase().endsWith('.mtl')) mtlFile = file;
                    if (filename.match(/\.(png|jpg|jpeg|webp)$/i)) {
                        const blob = await file.async('blob');
                        textureFiles[filename] = URL.createObjectURL(blob);
                    }
                }

                if (!objFile) throw new Error("No .obj file found in ZIP");

                const manager = new THREE.LoadingManager();
                manager.setURLModifier((url) => {
                    // Resolve texture paths to blob URLs
                    const fileName = url.split('/').pop() || '';
                    if (textureFiles[fileName]) return textureFiles[fileName];
                    return url;
                });

                let materials: MTLLoader.MaterialCreator | null = null;

                if (mtlFile) {
                    const mtlContent = await mtlFile.async('string');
                    const mtlLoader = new MTLLoader(manager);
                    materials = mtlLoader.parse(mtlContent, '');
                    materials.preload();
                }

                const objContent = await objFile.async('string');
                const objLoader = new OBJLoader(manager);
                if (materials) objLoader.setMaterials(materials);

                const object = objLoader.parse(objContent);
                onLoad(object);

                // Cleanup blob URLs on unmount
                return () => {
                    Object.values(textureFiles).forEach(url => URL.revokeObjectURL(url));
                };
            } catch (err) {
                console.error("ZipLoader Error:", err);
                onError(err);
            }
        };

        loadZip();
    }, [url]);

    return null;
}
