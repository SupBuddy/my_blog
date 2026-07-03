"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

// 注册 GSAP 插件
gsap.registerPlugin(useGSAP, ScrollTrigger);

interface GSAPAnimationsProps {
  children: React.ReactNode;
}

export function PostListAnimations({ children }: GSAPAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 文章卡片滚动触发动画
      gsap.from(".post-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef },
  );

  return <div ref={containerRef}>{children}</div>;
}

export function HeroAnimations() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero 区域保持页面加载动画（因为通常在视口内）
      gsap.from(".hero-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-description", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
      });
    },
    { scope: heroRef },
  );

  return heroRef;
}
