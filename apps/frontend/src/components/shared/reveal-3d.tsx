'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Reveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function Reveal3D({ children, className, delay = 0, direction = 'up' }: Reveal3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    let yOffset = 0;
    let xOffset = 0;
    let rotationX = 0;
    let rotationY = 0;

    switch (direction) {
      case 'up':
        yOffset = 100;
        rotationX = -45;
        break;
      case 'down':
        yOffset = -100;
        rotationX = 45;
        break;
      case 'left':
        xOffset = 100;
        rotationY = -45;
        break;
      case 'right':
        xOffset = -100;
        rotationY = 45;
        break;
    }

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: yOffset,
      x: xOffset,
      rotationX: rotationX,
      rotationY: rotationY,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)',
      delay: delay,
      transformPerspective: 1200,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className} style={{ opacity: 1, willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
