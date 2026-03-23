"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;

  // Hash for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // FBM (Fractal Brownian Motion) for clouds
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = uv * aspect;
    vec2 mouse = uMouse * aspect;

    // === SKY GRADIENT ===
    // Deep blue at top → light sky blue → warm horizon white at bottom
    vec3 skyTop = vec3(0.22, 0.45, 0.78);     // #3873C7 deep blue
    vec3 skyMid = vec3(0.45, 0.72, 0.95);     // #73B8F2 sky blue
    vec3 skyBottom = vec3(0.68, 0.85, 0.97);  // #ADD9F8 light horizon
    vec3 horizon = vec3(0.85, 0.92, 0.98);    // #D9EBFA white-blue horizon

    vec3 sky = mix(skyTop, skyMid, smoothstep(0.8, 0.45, uv.y));
    sky = mix(sky, skyBottom, smoothstep(0.45, 0.15, uv.y));
    sky = mix(sky, horizon, smoothstep(0.15, 0.0, uv.y));

    // === MOUSE — cloud parting setup ===
    float mouseDist = length(p - mouse);
    // Push cloud UVs away from cursor for displacement effect
    vec2 pushDir = mouseDist > 0.001 ? normalize(p - mouse) : vec2(0.0);
    float pushStrength = 0.15 * (1.0 - smoothstep(0.0, 0.4, mouseDist));
    vec2 cloudPush = pushDir * pushStrength;

    // === CLOUDS ===
    // Layer 1: Large soft clouds — slow drift
    vec2 cloudUV1 = p * 1.8 + vec2(uTime * 0.015, uTime * 0.005);
    cloudUV1 += (uMouse - 0.5) * 0.08 + cloudPush;
    float cloud1 = fbm(cloudUV1);
    cloud1 = smoothstep(0.35, 0.65, cloud1);

    // Layer 2: Medium detail clouds — slightly faster
    vec2 cloudUV2 = p * 3.0 + vec2(uTime * 0.025, -uTime * 0.008);
    cloudUV2 += (uMouse - 0.5) * 0.12 + cloudPush * 1.2;
    float cloud2 = fbm(cloudUV2 + 5.0);
    cloud2 = smoothstep(0.38, 0.68, cloud2);

    // Layer 3: Small wispy clouds — fastest drift
    vec2 cloudUV3 = p * 5.0 + vec2(uTime * 0.04, uTime * 0.012);
    cloudUV3 += (uMouse - 0.5) * 0.05 + cloudPush * 0.8;
    float cloud3 = fbm(cloudUV3 + 10.0);
    cloud3 = smoothstep(0.45, 0.72, cloud3);

    // Combine clouds — more clouds in upper portion
    float heightFade = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.5, uv.y);
    float clouds = (cloud1 * 0.6 + cloud2 * 0.3 + cloud3 * 0.15) * heightFade;

    // === CLOUD PARTING — fade clouds near cursor ===
    float partFactor = smoothstep(0.0, 0.35, mouseDist);
    clouds *= partFactor;

    // Cloud color — bright white with slight blue tint in shadows
    vec3 cloudBright = vec3(1.0, 1.0, 1.0);
    vec3 cloudShadow = vec3(0.75, 0.82, 0.92);
    vec3 cloudColor = mix(cloudShadow, cloudBright, clouds);

    // Blend clouds into sky
    vec3 color = mix(sky, cloudColor, clouds * 0.85);

    // === SOFT VIGNETTE ===
    float vig = 1.0 - length(uv - 0.5) * 0.3;
    color *= vig;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uTime = gl.getUniformLocation(program, "uTime");

    const resize = () => {
      const scale = 0.5;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handleMouse);

    let raf: number;
    const startTime = Date.now();

    const render = () => {
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.04;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uTime, (Date.now() - startTime) / 1000);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
