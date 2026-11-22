import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { soundService } from '../services/soundService';
import { rollTwoUnbiasedDice, getUnbiasedDieRoll } from '../utils/diceRandom';
import { Dices } from 'lucide-react';

export interface ThreeDiceRollHandle {
  roll: () => void;
  isRolling: () => boolean;
}

interface ThreeDiceRollProps {
  onRollComplete: (d1: number, d2: number) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

export const ThreeDiceRoll = forwardRef<ThreeDiceRollHandle, ThreeDiceRollProps>(({
  onRollComplete,
  disabled = false,
  compact = false,
  className = '',
}, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [rolling, setRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([1, 1]);
  const [webglFailed, setWebglFailed] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dice1Ref = useRef<THREE.Mesh | null>(null);
  const dice2Ref = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Helper to generate Canvas textures for the 6 dice faces
  const createDiceMaterials = () => {
    const materials: THREE.MeshStandardMaterial[] = [];
    const pipPositions: Record<number, number[][]> = {
      1: [[0.5, 0.5]],
      2: [[0.25, 0.25], [0.75, 0.75]],
      3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
      4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
      5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
      6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]]
    };

    // Standard dice arrangement: opposite faces sum to 7
    // BoxGeometry face order: +X (Right=1), -X (Left=6), +Y (Top=2), -Y (Bottom=5), +Z (Front=3), -Z (Back=4)
    const faceValues = [1, 6, 2, 5, 3, 4];

    faceValues.forEach((val) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Ivory / White rounded background with subtle warmth
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, 128, 128);

      // Subtle rounded border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 124, 124);

      // Draw pips (dots)
      const pips = pipPositions[val] || [];
      ctx.fillStyle = val === 1 ? '#EF4444' : '#1E293B'; // 1 is vibrant red, others slate

      pips.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x * 128, y * 128, 11, 0, Math.PI * 2);
        ctx.fill();
      });

      const texture = new THREE.CanvasTexture(canvas);
      materials.push(new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
        metalness: 0.1
      }));
    });

    return materials;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 240;
    const height = mountRef.current.clientHeight || (compact ? 75 : 120);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL context creation failed, using 2D dice fallback:', e);
      setWebglFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(compact ? 45 : 40, width / height, 0.1, 100);
    camera.position.set(0, compact ? 4.5 : 4.2, compact ? 4.8 : 5);
    camera.lookAt(0, 0, 0);

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mountRef.current);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    dirLight.position.set(4, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Dice Meshes
    const geom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const materials = createDiceMaterials();

    const d1 = new THREE.Mesh(geom, materials);
    d1.position.set(-1.1, 0, 0);
    d1.castShadow = true;
    scene.add(d1);
    dice1Ref.current = d1;

    const d2 = new THREE.Mesh(geom, materials);
    d2.position.set(1.1, 0, 0);
    d2.castShadow = true;
    scene.add(d2);
    dice2Ref.current = d2;

    const animate = () => {
      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      ro.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [compact]);

  // Map face value to Euler angles that put that face on TOP (+Y)
  // Face order: +X(1), -X(6), +Y(2), -Y(5), +Z(3), -Z(4)
  const getRotationForTopFace = (val: number): THREE.Euler => {
    switch (val) {
      case 2: return new THREE.Euler(0, 0, 0); // +Y already top
      case 5: return new THREE.Euler(Math.PI, 0, 0); // -Y flipped to top
      case 1: return new THREE.Euler(0, 0, Math.PI / 2); // +X rotated to top
      case 6: return new THREE.Euler(0, 0, -Math.PI / 2); // -X rotated to top
      case 3: return new THREE.Euler(-Math.PI / 2, 0, 0); // +Z rotated to top
      case 4: return new THREE.Euler(Math.PI / 2, 0, 0); // -Z rotated to top
      default: return new THREE.Euler(0, 0, 0);
    }
  };

  const rollDice = () => {
    if (rolling || disabled) return;

    setRolling(true);
    soundService.playDiceRoll();
    soundService.triggerHaptic('light');

    // Cryptographically unbiased hardware random values (1 to 6)
    const [result1, result2] = rollTwoUnbiasedDice();

    const d1 = dice1Ref.current;
    const d2 = dice2Ref.current;
    if (webglFailed || !d1 || !d2) {
      // 2D animation fallback with unbiased sampling
      const duration = 900;
      const interval = setInterval(() => {
        setDiceValues([
          getUnbiasedDieRoll(),
          getUnbiasedDieRoll(),
        ]);
      }, 70);

      setTimeout(() => {
        clearInterval(interval);
        setRolling(false);
        setDiceValues([result1, result2]);
        soundService.triggerHaptic('medium');
        onRollComplete(result1, result2);
      }, duration);
      return;
    }

    const targetRot1 = getRotationForTopFace(result1);
    const targetRot2 = getRotationForTopFace(result2);

    const startTime = performance.now();
    const duration = 1100; // ms

    // Store starting orientations
    const startRot1 = { x: d1.rotation.x, y: d1.rotation.y, z: d1.rotation.z };
    const startRot2 = { x: d2.rotation.x, y: d2.rotation.y, z: d2.rotation.z };

    // Extra spins so dice tumbles realistically before settling
    const extraSpinsX1 = Math.PI * 4;
    const extraSpinsY1 = Math.PI * 3;
    const extraSpinsZ1 = Math.PI * 2;

    const extraSpinsX2 = -Math.PI * 3.5;
    const extraSpinsY2 = Math.PI * 4;
    const extraSpinsZ2 = -Math.PI * 2.5;

    const spinRoutine = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        // High speed tumble phase (< 0.70)
        if (progress < 0.7) {
          const tumbleSpeed = 1 - (progress / 0.7) * 0.3; // Slight deceleration
          d1.rotation.x += 0.35 * tumbleSpeed;
          d1.rotation.y += 0.28 * tumbleSpeed;
          d1.rotation.z += 0.18 * tumbleSpeed;
          d1.position.y = Math.sin(progress * Math.PI * 4) * 0.45 * (1 - progress * 0.4);

          d2.rotation.x -= 0.25 * tumbleSpeed;
          d2.rotation.y += 0.38 * tumbleSpeed;
          d2.rotation.z -= 0.32 * tumbleSpeed;
          d2.position.y = Math.sin(progress * Math.PI * 4 + 0.5) * 0.45 * (1 - progress * 0.4);
        } else {
          // Smooth settling ease-out phase (0.70 to 1.0)
          const settleProgress = (progress - 0.7) / 0.3;
          // Cubic ease-out
          const easeOut = 1 - Math.pow(1 - settleProgress, 3);

          // Ease towards target face rotation
          d1.rotation.x = d1.rotation.x + (targetRot1.x - (d1.rotation.x % (Math.PI * 2))) * easeOut * 0.15;
          d1.rotation.z = d1.rotation.z + (targetRot1.z - (d1.rotation.z % (Math.PI * 2))) * easeOut * 0.15;
          d1.position.y = Math.sin(progress * Math.PI * 2) * 0.15 * (1 - easeOut);

          d2.rotation.x = d2.rotation.x + (targetRot2.x - (d2.rotation.x % (Math.PI * 2))) * easeOut * 0.15;
          d2.rotation.z = d2.rotation.z + (targetRot2.z - (d2.rotation.z % (Math.PI * 2))) * easeOut * 0.15;
          d2.position.y = Math.sin(progress * Math.PI * 2) * 0.15 * (1 - easeOut);
        }

        requestAnimationFrame(spinRoutine);
      } else {
        // Snap to target top face with zero bounce
        d1.position.y = 0;
        d2.position.y = 0;
        d1.rotation.set(targetRot1.x, targetRot1.y, targetRot1.z);
        d2.rotation.set(targetRot2.x, targetRot2.y, targetRot2.z);

        setRolling(false);
        setDiceValues([result1, result2]);
        soundService.triggerHaptic('medium');
        onRollComplete(result1, result2);
      }
    };

    requestAnimationFrame(spinRoutine);
  };

  useImperativeHandle(ref, () => ({
    roll: rollDice,
    isRolling: () => rolling
  }));

  const renderDicePips = (val: number, small = false) => {
    const dotGrid: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const activeDots = dotGrid[val] || [4];

    return (
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className="flex items-center justify-center">
            {activeDots.includes(idx) && (
              <div
                className={`rounded-full ${
                  small ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'
                } ${val === 1 ? 'bg-red-500 shadow-sm' : 'bg-slate-800'}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (compact) {
    if (webglFailed) {
      return (
        <div
          className={`flex items-center justify-center gap-2 cursor-pointer select-none py-1 ${className}`}
          onClick={rollDice}
          title="Tap to roll dice!"
        >
          <div
            className={`w-9 h-9 bg-[#FFFDF7] rounded-xl shadow-md border border-slate-300 flex items-center justify-center p-0.5 transition-transform ${
              rolling ? 'animate-bounce' : 'hover:scale-105'
            }`}
          >
            {renderDicePips(diceValues[0], true)}
          </div>
          <div
            className={`w-9 h-9 bg-[#FFFDF7] rounded-xl shadow-md border border-slate-300 flex items-center justify-center p-0.5 transition-transform ${
              rolling ? 'animate-bounce' : 'hover:scale-105'
            }`}
          >
            {renderDicePips(diceValues[1], true)}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={mountRef}
        className={`w-full h-full min-h-[60px] cursor-pointer flex items-center justify-center select-none ${className}`}
        onClick={rollDice}
        title="Tap to roll 3D dice!"
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center p-3 rounded-2xl select-none ${className}`}
      style={{
        background: '#193D5A',
        border: '2px solid rgba(255,255,255,0.18)',
        boxShadow: '0 8px 24px rgba(10,25,40,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      {webglFailed ? (
        <div
          onClick={rollDice}
          className="w-full h-[120px] flex items-center justify-center gap-6 cursor-pointer select-none"
          title="Click to roll dice!"
        >
          <div
            className={`w-16 h-16 bg-[#FFFDF7] rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.9),0_0_0_2px_#E2E8F0] p-1.5 transition-transform ${
              rolling ? 'animate-bounce rotate-12 scale-110' : 'hover:scale-105'
            }`}
          >
            {renderDicePips(diceValues[0])}
          </div>
          <div
            className={`w-16 h-16 bg-[#FFFDF7] rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.9),0_0_0_2px_#E2E8F0] p-1.5 transition-transform ${
              rolling ? 'animate-bounce -rotate-12 scale-110' : 'hover:scale-105'
            }`}
          >
            {renderDicePips(diceValues[1])}
          </div>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="w-full h-[120px] cursor-pointer flex items-center justify-center"
          onClick={rollDice}
          title="Click to roll 3D dice!"
        />
      )}
      
      <div className="flex items-center justify-between w-full mt-2 px-1">
        <div className="flex items-baseline gap-2">
          <span className="font-game text-xs text-[#A8B7C9] font-bold uppercase tracking-wider">Total:</span>
          <span className="font-display text-2xl text-[#EDB64D] text-glow-gold">
            {diceValues[0] + diceValues[1]}
          </span>
          <span className="font-game text-xs text-[#A8B7C9]">
            ({diceValues[0]} + {diceValues[1]})
          </span>
        </div>
        
        <button
          onClick={rollDice}
          disabled={rolling || disabled}
          className={`btn-clay-gold px-5 py-2.5 text-sm flex items-center gap-2 ${
            disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : 'hover:scale-105 active:scale-95'
          }`}
        >
          <Dices size={16} />
          <span>{rolling ? 'ROLLING...' : 'ROLL DICE'}</span>
        </button>
      </div>
    </div>
  );
});

ThreeDiceRoll.displayName = 'ThreeDiceRoll';
