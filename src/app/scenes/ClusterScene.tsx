import React, { Suspense } from 'react'
import { Canvas } from "@react-three/fiber";
import { createWebGPURenderer } from '../renderer/createWebGPURenderer';
import GaussianCluster from '../components/GaussianCluster';
import Loading from '../loading';

// Memoize renderer creation
const webgpuRendererPromise = createWebGPURenderer;

interface ClusterSceneProps {
    clusterPosition?: [number, number, number];
}

export default function ClusterScene({ clusterPosition }: ClusterSceneProps) {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas
                gl={webgpuRendererPromise}
                camera={{
                    fov: 35,
                    position: [0, 0, 70],
                    near: 1,
                    far: 500
                }}
                frameloop='always'>
                <Suspense fallback={<Loading/>}>
                    <GaussianCluster position={clusterPosition} />
                </Suspense>
            </Canvas>
        </div>
    )
}