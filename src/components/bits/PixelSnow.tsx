"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface PixelSnowProps {
  color?: string;
  flakeSize?: number;
  minFlakeSize?: number;
  pixelResolution?: number;
  speed?: number;
  density?: number;
  direction?: number;
  brightness?: number;
  depthFade?: number;
  farPlane?: number;
  gamma?: number;
  variant?: "square" | "circle";
  blending?: "additive" | "normal";
}

const vertexShader = `
  attribute float size;
  attribute float depth;
  varying float vDepth;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDirection;
  uniform float uFarPlane;

  void main() {
    vDepth = depth;

    float dirRad = uDirection * 3.14159 / 180.0;
    vec3 pos = position;

    // Move flakes based on time, speed, and direction
    pos.x += sin(dirRad) * uTime * uSpeed * (1.0 + depth * 0.5);
    pos.y -= cos(dirRad) * uTime * uSpeed * (1.0 + depth * 0.3);

    // Wrap around
    pos.x = mod(pos.x + 1.0, 2.0) - 1.0;
    pos.y = mod(pos.y + 1.0, 2.0) - 1.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (1.0 - depth / uFarPlane) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShaderCircle = `
  varying float vDepth;
  uniform vec3 uColor;
  uniform float uBrightness;
  uniform float uDepthFade;
  uniform float uFarPlane;
  uniform float uGamma;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.2, dist);
    float depthAlpha = 1.0 - (vDepth / uFarPlane) * uDepthFade;
    depthAlpha = clamp(depthAlpha, 0.05, 1.0);

    vec3 col = uColor * uBrightness;
    col = pow(col, vec3(uGamma));

    gl_FragColor = vec4(col, alpha * depthAlpha);
  }
`;

const fragmentShaderSquare = `
  varying float vDepth;
  uniform vec3 uColor;
  uniform float uBrightness;
  uniform float uDepthFade;
  uniform float uFarPlane;
  uniform float uGamma;

  void main() {
    float depthAlpha = 1.0 - (vDepth / uFarPlane) * uDepthFade;
    depthAlpha = clamp(depthAlpha, 0.05, 1.0);

    vec3 col = uColor * uBrightness;
    col = pow(col, vec3(uGamma));

    gl_FragColor = vec4(col, depthAlpha);
  }
`;

export const PixelSnow = ({
  color = "#ffffff",
  flakeSize = 0.01,
  minFlakeSize = 1.25,
  pixelResolution = 200,
  speed = 1.25,
  density = 0.3,
  direction = 125,
  brightness = 1,
  depthFade = 8,
  farPlane = 20,
  gamma = 0.4545,
  variant = "square",
  blending = "additive",
}: PixelSnowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    // Pixelated resolution
    const scale = Math.min(1, pixelResolution / Math.max(width, height));
    renderer.setSize(width * scale, height * scale);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.imageRendering = "pixelated";
    container.appendChild(renderer.domElement);

    // Generate particles
    const count = Math.floor(density * 1000);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const depths = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = -Math.random() * farPlane;
      depths[i] = Math.random() * farPlane;
      sizes[i] = Math.max(minFlakeSize, flakeSize * 100 * (1 + Math.random()));
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("depth", new THREE.BufferAttribute(depths, 1));

    const threeColor = new THREE.Color(color);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader:
        variant === "circle" ? fragmentShaderCircle : fragmentShaderSquare,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: threeColor },
        uSpeed: { value: speed },
        uDirection: { value: direction },
        uBrightness: { value: brightness },
        uDepthFade: { value: depthFade },
        uFarPlane: { value: farPlane },
        uGamma: { value: gamma },
      },
      transparent: true,
      depthWrite: false,
      blending:
        blending === "normal" ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const s = Math.min(1, pixelResolution / Math.max(w, h));
      renderer.setSize(w * s, h * s);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    color,
    flakeSize,
    minFlakeSize,
    pixelResolution,
    speed,
    density,
    direction,
    brightness,
    depthFade,
    farPlane,
    gamma,
    variant,
    blending,
  ]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
