'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, useEffect } from 'react';

// 注册 GSAP 插件
gsap.registerPlugin(useGSAP);

interface GSAPAnimationsProps {
  children: React.ReactNode;
}

export function PostListAnimations({ children }: GSAPAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 文章卡片交错入场动画
    gsap.from('.post-card', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

export function HeroAnimations() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero 视差滚动动画
    gsap.from('.hero-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.hero-description', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power3.out',
    });
  }, { scope: heroRef });

  return heroRef;
}

// 鼠标跟随视差效果
export function useParallaxEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / 50;
      const moveY = (clientY - centerY) / 50;

      gsap.to('.parallax-element', {
        x: moveX,
        y: moveY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
}