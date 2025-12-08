import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';

export default function GaussianCluster() {
    const state = useThree();
    // console.log(state)

    const groupRef = useRef<THREE.Group>(null!)
    
    // Box-Muller transform for generating Gaussian-distributed random numbers
    const gaussianRandom = (mean = 0, stdDev = 1) => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return z0 * stdDev + mean;
    }
    
    // Generate random point on a sphere around center
    const randomPointOnSphere = (center: THREE.Vector3, radius: number) => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
        const y = center.y + radius * Math.sin(phi) * Math.sin(theta);
        const z = center.z + radius * Math.cos(phi);
        
        return new THREE.Vector3(x, y, z);
    }
    
    const clusterGroup = useMemo(() => {
        const group = new THREE.Group();
        const centerPoints = [];
        const stdDev = 30;
        const numPoints = 5000; // Reduced for performance with shapes
        const shapeRadius = 2; // Distance from center to shape vertices
        
        // Generate center points
        for (let i = 0; i < numPoints; i++) {
            const x = gaussianRandom(0, stdDev);
            const y = gaussianRandom(0, stdDev);
            const z = gaussianRandom(0, stdDev);
            centerPoints.push(new THREE.Vector3(x, y, z));
        }
        
        // Create points geometry for centers
        // const pointsGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints);
        // const pointsMaterial = new THREE.PointsMaterial({ 
        //     color: '#fff',
        //     size: 0.2,
        //     transparent: true,
        //     opacity: 0.8,
        //     blending: THREE.AdditiveBlending
        // });
        // const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
        // group.add(pointCloud);
        
        // Create filled shapes around each center point
        const meshMaterial = new THREE.MeshStandardMaterial({ 
            color: '#313715',
            transparent: true,
            opacity: 10.6,
            side: THREE.DoubleSide,
            metalness: 0.3,
            roughness: 0.7
        });
        
        centerPoints.forEach(center => {
            // Randomly choose 3 or 4 vertices (triangle or square)
            const numVertices = Math.random() > 0.5 ? 3 : 4;
            const vertices = [];
            
            // Generate vertices around the center
            for (let i = 0; i < numVertices; i++) {
                vertices.push(randomPointOnSphere(center, shapeRadius));
            }
            
            // Create filled geometry
            const shapeGeometry = new THREE.BufferGeometry();
            const positions = [];
            
            if (numVertices === 3) {
                // Triangle - single face
                positions.push(
                    vertices[0].x, vertices[0].y, vertices[0].z,
                    vertices[1].x, vertices[1].y, vertices[1].z,
                    vertices[2].x, vertices[2].y, vertices[2].z
                );
            } else {
                // Square - two triangles
                positions.push(
                    vertices[0].x, vertices[0].y, vertices[0].z,
                    vertices[1].x, vertices[1].y, vertices[1].z,
                    vertices[2].x, vertices[2].y, vertices[2].z,
                    
                    vertices[0].x, vertices[0].y, vertices[0].z,
                    vertices[2].x, vertices[2].y, vertices[2].z,
                    vertices[3].x, vertices[3].y, vertices[3].z
                );
            }
            
            shapeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            shapeGeometry.computeVertexNormals();
            
            const mesh = new THREE.Mesh(shapeGeometry, meshMaterial);
            group.add(mesh);
        });
        
        group.rotation.set(0.5, 0.5, 0);
        
        // Translate to upper left
        // Negative X = left, Positive Y = up, Negative Z = forward
        group.position.set(-30, 30, 0);
        
        return group;
    }, [])

    useFrame(() => {
        groupRef.current.rotation.x += 0.0003;
        groupRef.current.rotation.y += 0.0005;
    })

    return (
        <>
            {/* Ambient light for overall illumination */}
            <ambientLight intensity={0.4} />            
            {/* Directional light for depth */}
            <directionalLight position={[10, 10, 5]} intensity={0.8} />            
            {/* Point light for highlights */}
            <pointLight position={[-30, 30, 20]} intensity={1} color="#ffffff" />

            <primitive ref={groupRef} object={clusterGroup} />
        </>
    )
}

// prev code
// import React, { useMemo, useRef } from 'react'
// import { useFrame, useThree } from "@react-three/fiber";
// import * as THREE from 'three';

// export default function GaussianCluster() {
//     const state = useThree();
//     console.log(state)

//     const groupRef = useRef<THREE.Group>(null!)
    
//     // Box-Muller transform for generating Gaussian-distributed random numbers
//     const gaussianRandom = (mean = 0, stdDev = 1) => {
//         const u1 = Math.random();
//         const u2 = Math.random();
//         const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
//         return z0 * stdDev + mean;
//     }
    
//     // Generate random point on a sphere around center
//     const randomPointOnSphere = (center: THREE.Vector3, radius: number) => {
//         const theta = Math.random() * Math.PI * 2;
//         const phi = Math.acos(2 * Math.random() - 1);
        
//         const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
//         const y = center.y + radius * Math.sin(phi) * Math.sin(theta);
//         const z = center.z + radius * Math.cos(phi);
        
//         return new THREE.Vector3(x, y, z);
//     }
    
//     const clusterGroup = useMemo(() => {
//         const group = new THREE.Group();
//         const centerPoints = [];
//         const stdDev = 8;
//         const numPoints = 200; // Reduced for performance with shapes
//         const shapeRadius = 3; // Distance from center to shape vertices
        
//         // Generate center points
//         for (let i = 0; i < numPoints; i++) {
//             const x = gaussianRandom(0, stdDev);
//             const y = gaussianRandom(0, stdDev);
//             const z = gaussianRandom(0, stdDev);
//             centerPoints.push(new THREE.Vector3(x, y, z));
//         }
        
//         // Create points geometry for centers
//         const pointsGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints);
//         const pointsMaterial = new THREE.PointsMaterial({ 
//             color: '#fff',
//             size: 0.2,
//             // transparent: true,
//             opacity: 1,
//             blending: THREE.AdditiveBlending
//         });
//         const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
//         group.add(pointCloud);
        
//         // Create shapes around each center point
//         const lineMaterial = new THREE.LineBasicMaterial({ 
//             color: '#f0f',
//             // transparent: true,
//             opacity: 1
//         });
        
//         centerPoints.forEach(center => {
//             // Randomly choose 3 or 4 vertices (triangle or square)
//             // const numVertices = Math.random() > 0.5 ? 3 : 4;
//             const numVertices = 3;
//             const vertices = [];
            
//             // Generate vertices around the center
//             for (let i = 0; i < numVertices; i++) {
//                 vertices.push(randomPointOnSphere(center, shapeRadius));
//             }
            
//             // Close the shape by adding first vertex at the end
//             vertices.push(vertices[0].clone());
            
//             // Create line geometry
//             const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
//             const line = new THREE.Line(lineGeometry, lineMaterial);
//             group.add(line);
//         });
        
//         group.rotation.set(0.5, 0.5, 0);
//         // Translate to upper left
//         // Negative X = left, Positive Y = up, Negative Z = forward
//         group.position.set(-10, 5, 0);
        
//         return group;
//     }, [])

//     useFrame(() => {
//         groupRef.current.rotation.x += 0.0003;
//         groupRef.current.rotation.y += 0.0005;
//     })

//     return <primitive ref={groupRef} object={clusterGroup} />
// }