'use client';

import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';

const ensureStandardMaterials = (object: THREE.Object3D) => {
    // Normalize scale for AR (roughly 1 meter)
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // If the model is too small or too big, scale it to a reasonable size for AR (1m)
    if (maxDim > 0) {
        const targetSize = 1.0;
        const scale = targetSize / maxDim;
        object.scale.multiplyScalar(scale);
        object.updateMatrixWorld(true);
    }

    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // Force conversion to MeshStandardMaterial as USDZ only supports this
            if (!child.material.isMeshStandardMaterial) {
                const oldMat = child.material as any;
                const newMat = new THREE.MeshStandardMaterial();

                // Transfer common properties
                if (oldMat.map) newMat.map = oldMat.map;
                if (oldMat.normalMap) newMat.normalMap = oldMat.normalMap;

                // Transfer color safely
                if (oldMat.color && oldMat.color.isColor) {
                    newMat.color.copy(oldMat.color);
                } else if (oldMat.color) {
                    newMat.color.set(oldMat.color);
                }

                if (oldMat.opacity !== undefined) {
                    newMat.opacity = oldMat.opacity;
                    newMat.transparent = oldMat.transparent || oldMat.opacity < 1;
                }

                // Default PBR values that look good in AR
                newMat.roughness = 0.6;
                newMat.metalness = 0.1;

                child.material = newMat;
            }
        }
    });
};

export const exportToGLB = (object: THREE.Object3D): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const clonedObject = object.clone();
        ensureStandardMaterials(clonedObject);

        const exporter = new GLTFExporter();
        exporter.parse(
            clonedObject,
            (result) => {
                if (result instanceof ArrayBuffer) {
                    resolve(new Blob([result], { type: 'model/gltf-binary' }));
                } else {
                    const json = JSON.stringify(result);
                    resolve(new Blob([json], { type: 'model/gltf+json' }));
                }
            },
            (error) => reject(error),
            { binary: true }
        );
    });
};

export const exportToUSDZ = async (object: THREE.Object3D): Promise<Blob> => {
    try {
        THREE.Cache.clear();
        const clonedObject = object.clone();
        ensureStandardMaterials(clonedObject);

        const exporter = new USDZExporter();
        // USDZExporter.parseAsync returns a Uint8Array
        const usdz = await exporter.parseAsync(clonedObject, {
            quickLookCompatible: true
        });
        return new Blob([usdz], { type: "application/octet-stream" });
    } catch (error) {
        throw new Error("Error exporting USDZ: " + error);
    }
};


export const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
