'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
}

export function Tilt3D({ children, className, maxTilt = 10, scale = 1.02 }: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Calculate mouse position relative to the center of the element (-1 to 1)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotationY: x * maxTilt * 2,
        rotationX: -y * maxTilt * 2,
        scale: scale,
        transformPerspective: 1000,
        transformOrigin: 'center center',
        ease: 'power2.out',
        duration: 0.4,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        ease: 'elastic.out(1, 0.3)',
        duration: 1.2,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}
