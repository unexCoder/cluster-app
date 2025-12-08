import React from 'react'
import * as THREE from 'three/webgpu'

export async function createWebGPURenderer(props: any): Promise<THREE.WebGPURenderer> {
  const renderer = new THREE.WebGPURenderer(props)
  await renderer.init()
  return renderer
}
