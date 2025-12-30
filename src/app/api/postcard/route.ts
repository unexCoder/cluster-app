// // app/api/postcard/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { createCanvas, Canvas } from 'canvas';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const numPoints: number = parseInt(searchParams.get('points') || '5000');

//   let bckGnd0: string = searchParams.get('bckGnda') || '#2EC4B6';
//   let bckGnd1: string = searchParams.get('bckGndb') || '#c30f45';
//   let color: string = searchParams.get('color') || '#231123';
//   const w: number = parseInt(searchParams.get('width') || '3840');

//   // Ensure colors have # prefix for canvas
//   bckGnd0 = bckGnd0.startsWith('#') ? bckGnd0 : `#${bckGnd0}`;
//   bckGnd1 = bckGnd1.startsWith('#') ? bckGnd1 : `#${bckGnd1}`;

//   const width: number = w * 3 / 4;  // 4K width
//   const height: number = w; // 4K height

//   // Create canvas
//   const canvas: Canvas = createCanvas(width, height);
//   const ctx = canvas.getContext('2d');

//   if (!ctx) {
//     return new NextResponse('Canvas context error', { status: 500 });
//   }

//   // Background
//   const bgGradient = ctx.createLinearGradient(0, 0, width, height);
//   bgGradient.addColorStop(0, bckGnd0);
//   bgGradient.addColorStop(1, bckGnd1);
//   ctx.fillStyle = bgGradient;
//   ctx.fillRect(0, 0, width, height);

//   // Box-Muller transform for Gaussian distribution
//   const gaussianRandom = (mean: number = 0, stdDev: number = 1): number => {
//     const u1 = Math.random();
//     const u2 = Math.random();
//     const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
//     return z0 * stdDev + mean;
//   };

//   // 3D Vector class
//   class Vector3 {
//     constructor(public x: number, public y: number, public z: number) { }
//   }

//   // Generate random point on sphere
//   const randomPointOnSphere = (center: Vector3, radius: number): Vector3 => {
//     const theta = Math.random() * Math.PI * 2;
//     const phi = Math.acos(2 * Math.random() - 1);

//     const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
//     const y = center.y + radius * Math.sin(phi) * Math.sin(theta);
//     const z = center.z + radius * Math.cos(phi);

//     return new Vector3(x, y, z);
//   };

//   // Simple 3D to 2D projection
//   const project = (point: Vector3, rotX: number, rotY: number): { x: number; y: number; z: number } => {
//     // Apply rotation around X axis
//     let y = point.y * Math.cos(rotX) - point.z * Math.sin(rotX);
//     let z = point.y * Math.sin(rotX) + point.z * Math.cos(rotX);
//     let x = point.x;

//     // Apply rotation around Y axis
//     const x2 = x * Math.cos(rotY) + z * Math.sin(rotY);
//     const z2 = -x * Math.sin(rotY) + z * Math.cos(rotY);

//     // Perspective projection with higher scale for 4K
//     const distance = 200;
//     const scale = (distance / (distance + z2)) * 8; // Increased scale factor

//     return {
//       x: x2 * scale + width / 2,
//       y: y * scale + height / 2,
//       z: z2
//     };
//   };

//   // Generate center points with Gaussian distribution
//   const stdDev = 40;
//   const shapeRadius = 4;
//   const shapes: Array<{ vertices: Vector3[]; center: Vector3 }> = [];

//   for (let i = 0; i < numPoints; i++) {
//     const center = new Vector3(
//       gaussianRandom(0, stdDev),
//       gaussianRandom(0, stdDev),
//       gaussianRandom(0, stdDev)
//     );

//     // Randomly choose 3 or 4 vertices
//     const numVertices = Math.random() > 0.5 ? 3 : 4;
//     const vertices: Vector3[] = [];

//     for (let j = 0; j < numVertices; j++) {
//       vertices.push(randomPointOnSphere(center, shapeRadius));
//     }

//     shapes.push({ vertices, center });
//   }

//   // Rotation angles (from the original position)
//   const rotX = 0.5;
//   const rotY = 0.5;

//   // Sort shapes by Z-depth (painter's algorithm)
//   const projectedShapes = shapes.map(shape => {
//     const projectedVertices = shape.vertices.map(v => project(v, rotX, rotY));
//     const avgZ = projectedVertices.reduce((sum, v) => sum + v.z, 0) / projectedVertices.length;
//     return { projectedVertices, avgZ };
//   });

//   projectedShapes.sort((a, b) => a.avgZ - b.avgZ);

//   // Draw shapes with lighting calculations
//   projectedShapes.forEach(({ projectedVertices, avgZ }, index) => {
//     // Get the original shape to calculate normal
//     const shape = shapes[projectedShapes.length - 1 - index]; // Reverse index due to sorting

//     // Calculate face normal (simplified for triangles/quads)
//     const v1 = shape.vertices[0];
//     const v2 = shape.vertices[1];
//     const v3 = shape.vertices[2];

//     // Cross product to get normal
//     const edge1 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
//     const edge2 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };

//     const normal = {
//       x: edge1.y * edge2.z - edge1.z * edge2.y,
//       y: edge1.z * edge2.x - edge1.x * edge2.z,
//       z: edge1.x * edge2.y - edge1.y * edge2.x
//     };

//     // Normalize
//     const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
//     normal.x /= length;
//     normal.y /= length;
//     normal.z /= length;

//     // Ambient light (intensity: 0.4)
//     const ambientIntensity = 0.4;
//     const ambientColor = { r: 255, g: 255, b: 255 };

//     // Directional light (position: [10, 10, 5], intensity: 0.8)
//     const dirLightDir = { x: 10, y: 10, z: 5 };
//     const dirLength = Math.sqrt(dirLightDir.x ** 2 + dirLightDir.y ** 2 + dirLightDir.z ** 2);
//     dirLightDir.x /= dirLength;
//     dirLightDir.y /= dirLength;
//     dirLightDir.z /= dirLength;

//     const dirDot = Math.max(0, normal.x * dirLightDir.x + normal.y * dirLightDir.y + normal.z * dirLightDir.z);
//     const directionalIntensity = 0.8 * dirDot;
//     const dirLightColor = { r: 255, g: 255, b: 255 };

//     // Point light (position: [-30, 30, 20], intensity: 1, color: white)
//     const pointLightPos = { x: -30, y: 30, z: 20 };
//     const pointLightColor = { r: 255, g: 255, b: 255 };
//     const toLight = {
//       x: pointLightPos.x - shape.center.x,
//       y: pointLightPos.y - shape.center.y,
//       z: pointLightPos.z - shape.center.z
//     };
//     const toLightLength = Math.sqrt(toLight.x ** 2 + toLight.y ** 2 + toLight.z ** 2);
//     toLight.x /= toLightLength;
//     toLight.y /= toLightLength;
//     toLight.z /= toLightLength;

//     const pointDot = Math.max(0, normal.x * toLight.x + normal.y * toLight.y + normal.z * toLight.z);
//     const attenuation = 1 / (1 + 0.01 * toLightLength);
//     const pointIntensity = 1.0 * pointDot * attenuation;

//     const baseR = parseColor(color).r;
//     const baseG = parseColor(color).g;
//     const baseB = parseColor(color).b;

//     // Apply ambient light color contribution
//     const ambientR = (baseR / 255) * ambientColor.r * ambientIntensity;
//     const ambientG = (baseG / 255) * ambientColor.g * ambientIntensity;
//     const ambientB = (baseB / 255) * ambientColor.b * ambientIntensity;

//     // Apply directional light color contribution
//     const dirR = (baseR / 255) * dirLightColor.r * directionalIntensity;
//     const dirG = (baseG / 255) * dirLightColor.g * directionalIntensity;
//     const dirB = (baseB / 255) * dirLightColor.b * directionalIntensity;

//     // Apply point light color contribution
//     const pointR = (baseR / 255) * pointLightColor.r * pointIntensity;
//     const pointG = (baseG / 255) * pointLightColor.g * pointIntensity;
//     const pointB = (baseB / 255) * pointLightColor.b * pointIntensity;

//     // MeshStandardMaterial properties: metalness: 0.3, roughness: 0.7
//     const metalness = 10.3;
//     const roughness = 0.7;

//     // Combine all light contributions
//     const totalR = ambientR + dirR + pointR;
//     const totalG = ambientG + dirG + pointG;
//     const totalB = ambientB + dirB + pointB;

//     // Simulate metalness (adds reflectivity/specular)
//     const specularBoost = metalness * (directionalIntensity + pointIntensity) * 0.5;

//     // Apply roughness (affects how specular is distributed)
//     const roughnessFactor = 1 - (roughness * 0.3);

//     const finalR = Math.min(255, Math.floor((totalR + specularBoost * 255) * roughnessFactor));
//     const finalG = Math.min(255, Math.floor((totalG + specularBoost * 255) * roughnessFactor));
//     const finalB = Math.min(255, Math.floor((totalB + specularBoost * 255) * roughnessFactor));

//     // Opacity matching original: opacity: 0.6
//     const baseOpacity = 0.6;
//     const depthOpacity = Math.max(0.3, Math.min(1, 1 - (avgZ + 100) / 200));
//     const opacity = baseOpacity * depthOpacity;

//     ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${opacity})`;
//     ctx.strokeStyle = `rgba(${Math.floor(finalR * 1.2)}, ${Math.floor(finalG * 1.2)}, ${Math.floor(finalB * 1.2)}, ${opacity * 0.5})`;
//     ctx.lineWidth = 1.5; // Thicker lines for 4K

//     ctx.beginPath();
//     ctx.moveTo(projectedVertices[0].x, projectedVertices[0].y);
//     for (let i = 1; i < projectedVertices.length; i++) {
//       ctx.lineTo(projectedVertices[i].x, projectedVertices[i].y);
//     }
//     ctx.closePath();
//     ctx.fill();
//     ctx.stroke();
//   });

//   // Reset shadow for clean output
//   ctx.shadowColor = 'transparent';
//   ctx.shadowBlur = 0;

//   // Convert to PNG buffer
//   const buffer: Buffer = canvas.toBuffer('image/png');

//   return new NextResponse(buffer as unknown as BodyInit, {
//     headers: {
//       'Content-Type': 'image/png',
//       'Cache-Control': 'public, max-age=604800, immutable',
//     },
//   });
// }

// // Example usage:
// // GET /api/postcard?points=3000

// // Parse hex color to RGB
// function parseColor(hex: string): { r: number; g: number; b: number } {
//   hex = hex.replace(/^(0x|#)/, '').padStart(6, '0');

//   if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
//     hex = '313715'; // default
//   }

//   const num = parseInt(hex, 16);
//   return {
//     r: (num >> 16) & 0xFF,
//     g: (num >> 8) & 0xFF,
//     b: num & 0xFF
//   };
// }

// app/api/postcard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, Canvas, registerFont } from 'canvas';
import path from 'path';

// Register your custom font (do this once at module load)
// Adjust the path to match where your font file is located
try {
  registerFont(path.join(process.cwd(), 'public/fonts/Montreal.otf'), { 
    family: 'Montreal' 
  });
} catch (error) {
  console.error('Font registration failed:', error);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const numPoints: number = parseInt(searchParams.get('points') || '5000');

  let bckGnd0: string = searchParams.get('bckGnda') || '#2EC4B6';
  let bckGnd1: string = searchParams.get('bckGndb') || '#c30f45';
  let color: string = searchParams.get('color') || '#231123';
  const w: number = parseInt(searchParams.get('width') || '3840');
  
  // Ensure colors have # prefix for canvas
  bckGnd0 = bckGnd0.startsWith('#') ? bckGnd0 : `#${bckGnd0}`;
  bckGnd1 = bckGnd1.startsWith('#') ? bckGnd1 : `#${bckGnd1}`;
  
  const width: number = w * 3 / 4;
  const height: number = w;
  
  // Text parameters
  const text: string | null = searchParams.get('text');
  const textColor: string = searchParams.get('textColor') || 'ffffff';
  const textSize: number = parseInt(searchParams.get('textSize') || '200');
  const textPosition: string = searchParams.get('textPos') || 'center';

  // Parse cluster color ONCE before the loop
  const clusterRGB = parseColor(color);
  // console.log('Cluster RGB:', clusterRGB); // DEBUG

  // Create canvas
  const canvas: Canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new NextResponse('Canvas context error', { status: 500 });
  }

  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, bckGnd0);
  bgGradient.addColorStop(1, bckGnd1);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Box-Muller transform for Gaussian distribution
  const gaussianRandom = (mean: number = 0, stdDev: number = 1): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  };

  // 3D Vector class
  class Vector3 {
    constructor(public x: number, public y: number, public z: number) { }
  }

  // Generate random point on sphere
  const randomPointOnSphere = (center: Vector3, radius: number): Vector3 => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
    const y = center.y + radius * Math.sin(phi) * Math.sin(theta);
    const z = center.z + radius * Math.cos(phi);

    return new Vector3(x, y, z);
  };

  // Simple 3D to 2D projection
  const project = (point: Vector3, rotX: number, rotY: number): { x: number; y: number; z: number } => {
    let y = point.y * Math.cos(rotX) - point.z * Math.sin(rotX);
    let z = point.y * Math.sin(rotX) + point.z * Math.cos(rotX);
    let x = point.x;

    const x2 = x * Math.cos(rotY) + z * Math.sin(rotY);
    const z2 = -x * Math.sin(rotY) + z * Math.cos(rotY);

    const distance = 200;
    const scale = (distance / (distance + z2)) * 8;

    return {
      x: x2 * scale + width / 2,
      y: y * scale + height / 2,
      z: z2
    };
  };

  // Generate center points with Gaussian distribution
  const stdDev = 40;
  const shapeRadius = 4;
  const shapes: Array<{ vertices: Vector3[]; center: Vector3 }> = [];

  for (let i = 0; i < numPoints; i++) {
    const center = new Vector3(
      gaussianRandom(0, stdDev),
      gaussianRandom(0, stdDev),
      gaussianRandom(0, stdDev)
    );

    const numVertices = Math.random() > 0.5 ? 3 : 4;
    const vertices: Vector3[] = [];

    for (let j = 0; j < numVertices; j++) {
      vertices.push(randomPointOnSphere(center, shapeRadius));
    }

    shapes.push({ vertices, center });
  }

  // Rotation angles
  const rotX = 0.5;
  const rotY = 0.5;

  // Sort shapes by Z-depth (painter's algorithm)
  const projectedShapes = shapes.map(shape => {
    const projectedVertices = shape.vertices.map(v => project(v, rotX, rotY));
    const avgZ = projectedVertices.reduce((sum, v) => sum + v.z, 0) / projectedVertices.length;
    return { projectedVertices, avgZ };
  });

  projectedShapes.sort((a, b) => a.avgZ - b.avgZ);

  // Draw shapes with lighting calculations
  projectedShapes.forEach(({ projectedVertices, avgZ }, index) => {
    const shape = shapes[projectedShapes.length - 1 - index];

    const v1 = shape.vertices[0];
    const v2 = shape.vertices[1];
    const v3 = shape.vertices[2];

    const edge1 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
    const edge2 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };

    const normal = {
      x: edge1.y * edge2.z - edge1.z * edge2.y,
      y: edge1.z * edge2.x - edge1.x * edge2.z,
      z: edge1.x * edge2.y - edge1.y * edge2.x
    };

    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    normal.x /= length;
    normal.y /= length;
    normal.z /= length;

    // Lighting
    const ambientIntensity = 0.4;
    const ambientColor = { r: 255, g: 255, b: 255 };

    const dirLightDir = { x: 10, y: 10, z: 5 };
    const dirLength = Math.sqrt(dirLightDir.x ** 2 + dirLightDir.y ** 2 + dirLightDir.z ** 2);
    dirLightDir.x /= dirLength;
    dirLightDir.y /= dirLength;
    dirLightDir.z /= dirLength;

    const dirDot = Math.max(0, normal.x * dirLightDir.x + normal.y * dirLightDir.y + normal.z * dirLightDir.z);
    const directionalIntensity = 0.8 * dirDot;
    const dirLightColor = { r: 255, g: 255, b: 255 };

    const pointLightPos = { x: -30, y: 30, z: 20 };
    const pointLightColor = { r: 255, g: 255, b: 255 };
    const toLight = {
      x: pointLightPos.x - shape.center.x,
      y: pointLightPos.y - shape.center.y,
      z: pointLightPos.z - shape.center.z
    };
    const toLightLength = Math.sqrt(toLight.x ** 2 + toLight.y ** 2 + toLight.z ** 2);
    toLight.x /= toLightLength;
    toLight.y /= toLightLength;
    toLight.z /= toLightLength;

    const pointDot = Math.max(0, normal.x * toLight.x + normal.y * toLight.y + normal.z * toLight.z);
    const attenuation = 1 / (1 + 0.01 * toLightLength);
    const pointIntensity = 1.0 * pointDot * attenuation;

    // Use pre-parsed cluster color
    const baseR = clusterRGB.r;
    const baseG = clusterRGB.g;
    const baseB = clusterRGB.b;

    const ambientR = (baseR / 255) * ambientColor.r * ambientIntensity;
    const ambientG = (baseG / 255) * ambientColor.g * ambientIntensity;
    const ambientB = (baseB / 255) * ambientColor.b * ambientIntensity;

    const dirR = (baseR / 255) * dirLightColor.r * directionalIntensity;
    const dirG = (baseG / 255) * dirLightColor.g * directionalIntensity;
    const dirB = (baseB / 255) * dirLightColor.b * directionalIntensity;

    const pointR = (baseR / 255) * pointLightColor.r * pointIntensity;
    const pointG = (baseG / 255) * pointLightColor.g * pointIntensity;
    const pointB = (baseB / 255) * pointLightColor.b * pointIntensity;

    const metalness = 10.3;
    const roughness = 0.7;

    const totalR = ambientR + dirR + pointR;
    const totalG = ambientG + dirG + pointG;
    const totalB = ambientB + dirB + pointB;

    const specularBoost = metalness * (directionalIntensity + pointIntensity) * 0.5;
    const roughnessFactor = 1 - (roughness * 0.3);

    const finalR = Math.min(255, Math.floor((totalR + specularBoost * 255) * roughnessFactor));
    const finalG = Math.min(255, Math.floor((totalG + specularBoost * 255) * roughnessFactor));
    const finalB = Math.min(255, Math.floor((totalB + specularBoost * 255) * roughnessFactor));

    const baseOpacity = 0.6;
    const depthOpacity = Math.max(0.3, Math.min(1, 1 - (avgZ + 100) / 200));
    const opacity = baseOpacity * depthOpacity;

    ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${opacity})`;
    ctx.strokeStyle = `rgba(${Math.floor(finalR * 1.2)}, ${Math.floor(finalG * 1.2)}, ${Math.floor(finalB * 1.2)}, ${opacity * 0.5})`;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(projectedVertices[0].x, projectedVertices[0].y);
    for (let i = 1; i < projectedVertices.length; i++) {
      ctx.lineTo(projectedVertices[i].x, projectedVertices[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Draw text AFTER cluster rendering complete
  if (text) {
    // console.log('Drawing text:', text, 'color:', textColor, 'size:', textSize); // DEBUG
    
    let textY: number;
    switch (textPosition) {
      case 'top':
        textY = height * 0.08;
        break;
      case 'bottom':
        textY = height * 0.85;
        break;
      case 'center':
      default:
        textY = height / 2;
        break;
    }

    const textX = width / 2;
    
    // Use custom font
    ctx.font = `bold ${textSize}px Montreal`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    // Draw VERY thick black outline in multiple passes
    // ctx.strokeStyle = '#000000';
    // ctx.lineWidth = textSize / 4; // Very thick
    // ctx.strokeText(text, textX, textY);
    
    // ctx.lineWidth = textSize / 5;
    // ctx.strokeText(text, textX, textY);
    
    // ctx.lineWidth = textSize / 6;
    // ctx.strokeText(text, textX, textY);

    // Set shadow properties before drawing text
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Black with 30% opacity
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 9;
    ctx.shadowOffsetY = 9;
    
    // Fill with bright color on top
    const finalTextColor = textColor.startsWith('#') ? textColor : `#${textColor}`;
    ctx.fillStyle = finalTextColor;
    ctx.fillText(text, textX, textY);
    
    // Reset shadow to avoid affecting other drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    // console.log('Text drawn at:', textX, textY, 'with color:', finalTextColor); // DEBUG
  }

  const buffer: Buffer = canvas.toBuffer('image/png');

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  });
}

function parseColor(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^(0x|#)/, '').padStart(6, '0');

  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    hex = '313715';
  }

  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 0xFF,
    g: (num >> 8) & 0xFF,
    b: num & 0xFF
  };
}

// Example:
// /api/postcard?text=HELLO%20WORLD&textColor=ffffff&textSize=200&textPos=center