"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * MouseFollowGlow 组件
 * 鼠标跟随的模糊弥散背景动画
 *
 * 特性：
 * - 清新时尚的彩色光晕（蓝、紫、粉、青）
 * - 多层光斑叠加实现柔和渐变
 * - 移动端：随机自由缓慢移动（±30% 范围，5 秒周期）
 * - 桌面端：GSAP quickTo 实现低延迟鼠标跟随
 * - 响应式自动切换移动逻辑
 * - Dark Mode 支持
 */

export function MouseFollowGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP();

  useEffect(() => {
    if (!glowRef.current) return;

    const glowElement = glowRef.current;

    // 清新时尚的彩色系
    const lightModeColors = [
      "rgba(120, 160, 255, 0.30)", // 清新蓝
      "rgba(180, 130, 255, 0.30)", // 薰衣草紫
      "rgba(255, 130, 180, 0.25)", // 樱花粉
      "rgba(100, 220, 220, 0.28)", // 薄荷青
    ];

    const darkModeColors = [
      "rgba(100, 140, 255, 0.22)", // 星空蓝
      "rgba(160, 120, 255, 0.22)", // 梦幻紫
      "rgba(255, 120, 160, 0.18)", // 玫瑰粉
      "rgba(80, 200, 210, 0.20)", // 深海青
    ];

    // 检测当前主题
    const isDarkMode = document.documentElement.classList.contains("dark");
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    // 颜色渐变动画 - 使用 power1.inOut 实现柔和过渡
    let currentColorIndex = 0;

    const animateColor = contextSafe(() => {
      const nextColorIndex = (currentColorIndex + 1) % colors.length;
      const nextColor = colors[nextColorIndex];

      gsap.to(glowElement, {
        "--glow-color": nextColor,
        duration: 6,
        ease: "power1.inOut",
        onComplete: () => {
          currentColorIndex = nextColorIndex;
          animateColor();
        },
      });
    });

    // 初始化颜色
    gsap.set(glowElement, { "--glow-color": colors[0] });
    animateColor();

    // ========== 移动逻辑 ==========

    // 检测设备类型（基于 Tailwind md 断点）
    let isMobile = window.innerWidth < 768;

    // 桌面端：鼠标跟随逻辑
    const xTo = gsap.quickTo(glowElement, "x", {
      duration: 0.8,
      ease: "power2.out",
    });

    const yTo = gsap.quickTo(glowElement, "y", {
      duration: 0.8,
      ease: "power2.out",
    });

    const handleMouseMove = contextSafe((e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const offsetX = (e.clientX - centerX) * 0.8;
      const offsetY = (e.clientY - centerY) * 0.8;

      xTo(offsetX);
      yTo(offsetY);
    });

    // 移动端：随机自由移动逻辑
    const animateRandomMovement = contextSafe(() => {
      // 移动范围：±30% 视口宽度和高度
      const rangeX = window.innerWidth * 0.3;
      const rangeY = window.innerHeight * 0.3;

      // 随机生成目标位置（相对于视口中心）
      const targetX = (Math.random() - 0.5) * 2 * rangeX;
      const targetY = (Math.random() - 0.5) * 2 * rangeY;

      // 缓慢移动（5 秒周期）
      gsap.to(glowElement, {
        x: targetX,
        y: targetY,
        duration: 5,
        ease: "power1.inOut", // 缓入缓出，非常柔和
        onComplete: animateRandomMovement, // 循环移动
      });
    });

    // 响应式切换逻辑
    const handleResize = contextSafe(() => {
      const newIsMobile = window.innerWidth < 768;

      // 只在设备类型切换时执行
      if (newIsMobile !== isMobile) {
        if (newIsMobile) {
          // 切换到移动端模式
          // 1. 停止鼠标跟随
          window.removeEventListener("mousemove", handleMouseMove);

          // 2. 清理桌面端动画状态
          gsap.killTweensOf(glowElement);

          // 3. 启动随机移动
          animateRandomMovement();
        } else {
          // 切换到桌面端模式
          // 1. 停止随机移动
          gsap.killTweensOf(glowElement);

          // 2. 重置位置到中心
          gsap.set(glowElement, { x: 0, y: 0 });

          // 3. 启动鼠标跟随
          window.addEventListener("mousemove", handleMouseMove);
        }

        isMobile = newIsMobile;
      }
    });

    // 初始化：根据当前设备类型启动相应逻辑
    if (isMobile) {
      animateRandomMovement();
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const newIsDarkMode =
            document.documentElement.classList.contains("dark");
          const newColors = newIsDarkMode ? darkModeColors : lightModeColors;

          gsap.to(glowElement, {
            "--glow-color": newColors[currentColorIndex],
            duration: 0.8,
            ease: "power2.inOut",
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 清理所有动画和事件监听
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      gsap.killTweensOf(glowElement); // 清理所有 GSAP 动画
    };
  }, [contextSafe]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      style={{
        // @ts-ignore - CSS 变量类型定义
        "--glow-color": "rgba(120, 160, 255, 0.30)",
      }}
    >
      {/* 移动端 - 多层光斑叠加实现柔和渐变 */}
      <div className="relative md:hidden">
        {/* 外层大光晕 */}
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-color) 0%, transparent 70%)",
            opacity: 0.5,
          }}
        />
        {/* 内层亮芯 */}
        <div
          className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-color) 0%, transparent 60%)",
            opacity: 0.8,
          }}
        />
      </div>

      {/* 桌面端 - 多层光斑叠加实现柔和渐变 */}
      <div className="relative hidden md:block">
        {/* 外层大光晕 */}
        <div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-color) 0%, transparent 70%)",
            opacity: 0.5,
          }}
        />
        {/* 中层过渡 */}
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-color) 0%, transparent 65%)",
            opacity: 0.7,
          }}
        />
        {/* 内层亮芯 */}
        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px]"
          style={{
            background:
              "radial-gradient(circle, var(--glow-color) 0%, transparent 55%)",
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}
