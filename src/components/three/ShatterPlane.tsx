"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;

  attribute vec3 aCenter;
  attribute float aRandom;

  varying vec2 vUv;
  varying float vProgress;

  // Simple rotation matrix around Z axis
  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    vUv = uv;
    vProgress = uProgress;

    vec3 pos = position;

    // Direction: radial from center of each face
    vec3 dir = pos - aCenter;
    float dist = length(aCenter.xy);

    // Shockwave delay: center shatters first
    float delay = smoothstep(0.0, 0.8, dist / 1.2);
    float adjustedProgress = max(0.0, uProgress - delay * 0.3);
    float force = adjustedProgress * (1.0 + aRandom * 0.5);

    // Push fragments outward along Z
    pos.z += force * (2.0 + aRandom * 4.0);

    // Scatter in XY
    pos.xy += normalize(dir.xy + 0.001) * force * (0.3 + aRandom * 0.8);

    // Tumble rotation
    float angle = adjustedProgress * aRandom * 6.28318;
    vec2 centered = pos.xy - aCenter.xy;
    centered = rotate2d(angle) * centered;
    pos.xy = centered + aCenter.xy;

    // Slight gravity pull downward
    pos.y -= force * force * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform float uTime;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    // Refraction distortion
    vec2 refractOffset = vec2(
      sin(vUv.y * 10.0 + uTime * 2.0),
      cos(vUv.x * 10.0 + uTime * 2.0)
    ) * 0.015 * vProgress;

    vec4 texColor = texture2D(uTexture, vUv + refractOffset);

    // Glass tint: slight purple
    vec3 glassTint = vec3(0.75, 0.65, 0.95);
    vec3 color = mix(texColor.rgb, glassTint, 0.1 + vProgress * 0.15);

    // Edge highlight (Fresnel-like)
    float edgeX = smoothstep(0.0, 0.03, abs(vUv.x - round(vUv.x * 40.0) / 40.0));
    float edgeY = smoothstep(0.0, 0.03, abs(vUv.y - round(vUv.y * 40.0) / 40.0));
    float edge = 1.0 - edgeX * edgeY;
    color += vec3(0.8, 0.6, 1.0) * edge * 0.4 * vProgress;

    // Fade out as fragments scatter
    float alpha = 1.0 - smoothstep(0.5, 1.0, vProgress);

    gl_FragColor = vec4(color, alpha);
  }
`;

interface ShatterPlaneProps {
  texture: THREE.Texture;
  shatterProgress: number;
}

export const ShatterPlane = ({ texture, shatterProgress }: ShatterPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const aspect = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 16 / 9;
    const geo = new THREE.PlaneGeometry(aspect * 2, 2, 40, 40);

    // Compute per-vertex attributes: center of each quad face and random seed
    const posAttr = geo.getAttribute("position");
    const indexAttr = geo.getIndex();

    const centerArray = new Float32Array(posAttr.count * 3);
    const randomArray = new Float32Array(posAttr.count);

    // Seed random values per vertex
    for (let i = 0; i < posAttr.count; i++) {
      randomArray[i] = Math.random();
    }

    // Compute face centers and assign to vertices
    if (indexAttr) {
      for (let i = 0; i < indexAttr.count; i += 3) {
        const a = indexAttr.getX(i);
        const b = indexAttr.getX(i + 1);
        const c = indexAttr.getX(i + 2);

        const cx =
          (posAttr.getX(a) + posAttr.getX(b) + posAttr.getX(c)) / 3;
        const cy =
          (posAttr.getY(a) + posAttr.getY(b) + posAttr.getY(c)) / 3;
        const cz =
          (posAttr.getZ(a) + posAttr.getZ(b) + posAttr.getZ(c)) / 3;

        for (const idx of [a, b, c]) {
          centerArray[idx * 3] = cx;
          centerArray[idx * 3 + 1] = cy;
          centerArray[idx * 3 + 2] = cz;
        }

        // Shared random per face
        const faceRand = Math.random();
        randomArray[a] = faceRand;
        randomArray[b] = faceRand;
        randomArray[c] = faceRand;
      }
    }

    geo.setAttribute("aCenter", new THREE.BufferAttribute(centerArray, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randomArray, 1));

    const u = {
      uTexture: { value: texture },
      uProgress: { value: 0 },
      uTime: { value: 0 },
    };

    return { geometry: geo, uniforms: u };
  }, [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = shatterProgress;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
