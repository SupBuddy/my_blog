"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/types";

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

interface AboutPageProps {
  params: {
    locale: Locale;
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero 区域保持页面加载动画（因为通常在视口内）
      gsap.fromTo(
        ".about-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );

      // 为每个 section 创建独立的滚动触发动画
      const sections = gsap.utils.toArray<HTMLElement>(".about-section");

      sections.forEach((section) => {
        // Section 标题和内容动画
        gsap.fromTo(
          section,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Feature items 动画（如果存在）
        const featureItems = section.querySelectorAll(".feature-item");
        if (featureItems.length > 0) {
          gsap.fromTo(
            featureItems,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        // Tech stack cards 动画（如果存在）
        const stackCards = section.querySelectorAll(".stack-card");
        if (stackCards.length > 0) {
          gsap.fromTo(
            stackCards,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });
    },
    { scope: containerRef },
  );

  const content = {
    zh: {
      title: "关于本站",
      subtitle: "一个现代化的全栈博客系统",
      sections: [
        {
          title: "项目简介",
          content:
            "本博客系统是一个基于 Next.js 14+ App Router 构建的现代化全栈应用。采用前后端同构开发模式，结合 Serverless 数据库与边缘计算部署，旨在提供极致的访问性能与丝滑的用户交互体验。",
        },
        {
          title: "核心特性",
          features: [
            "React Server Components + Client Components 混合渲染",
            "TypeScript 严格模式，全链路类型安全",
            "Drizzle ORM + Neon PostgreSQL",
            "Clerk 身份认证系统",
            "TipTap 富文本编辑器",
            "中英双语支持（i18n）",
            "暗黑模式无闪烁切换",
            "GSAP 动画引擎（视差滚动、入场动画）",
            "shadcn/ui + Tailwind CSS",
            "动态 SEO 和 OG 社交分享卡片",
            "Vercel 零配置部署",
          ],
        },
        {
          title: "技术栈",
          stack: [
            {
              category: "核心框架",
              items: "Next.js 14+, TypeScript, React 18+",
            },
            {
              category: "UI & 样式",
              items: "Tailwind CSS, shadcn/ui, GSAP, next-themes",
            },
            { category: "数据层", items: "Drizzle ORM, Neon PostgreSQL" },
            { category: "认证", items: "Clerk Authentication" },
            { category: "富文本", items: "TipTap Editor, Shiki" },
            { category: "部署", items: "Vercel Edge Computing" },
          ],
        },
        {
          title: "开发初衷",
          content:
            "这个项目旨在探索和实践 Next.js App Router 的最佳实践，展示如何构建一个现代化的全栈博客系统。通过 Server Components、Server Actions、Drizzle ORM 等技术，实现高性能、类型安全、易于维护的应用架构。",
        },
        {
          title: "开源与分享",
          content:
            "项目完全开源，代码托管在 GitHub 上。欢迎开发者学习和参考，如有问题或建议，欢迎提交 Issue 或 Pull Request。",
        },
      ],
      footer: "感谢您的访问！",
    },
    en: {
      title: "About This Blog",
      subtitle: "A Modern Full-Stack Blog System",
      sections: [
        {
          title: "Project Overview",
          content:
            "This blog system is a modern full-stack application built with Next.js 14+ App Router. It combines isomorphic development patterns with Serverless database and edge computing deployment, aiming to deliver exceptional performance and smooth user experience.",
        },
        {
          title: "Key Features",
          features: [
            "React Server Components + Client Components hybrid rendering",
            "TypeScript strict mode with end-to-end type safety",
            "Drizzle ORM + Neon PostgreSQL",
            "Clerk Authentication System",
            "TipTap Rich Text Editor",
            "Bilingual Support (Chinese & English)",
            "Dark Mode with seamless switching",
            "GSAP Animation Engine (parallax scrolling, entrance animations)",
            "shadcn/ui + Tailwind CSS",
            "Dynamic SEO and OG social sharing cards",
            "Zero-config deployment on Vercel",
          ],
        },
        {
          title: "Tech Stack",
          stack: [
            {
              category: "Core Framework",
              items: "Next.js 14+, TypeScript, React 18+",
            },
            {
              category: "UI & Styling",
              items: "Tailwind CSS, shadcn/ui, GSAP, next-themes",
            },
            { category: "Data Layer", items: "Drizzle ORM, Neon PostgreSQL" },
            { category: "Authentication", items: "Clerk Authentication" },
            { category: "Rich Text", items: "TipTap Editor, Shiki" },
            { category: "Deployment", items: "Vercel Edge Computing" },
          ],
        },
        {
          title: "Development Purpose",
          content:
            "This project aims to explore and demonstrate best practices for Next.js App Router, showcasing how to build a modern full-stack blog system. Through Server Components, Server Actions, Drizzle ORM, and other technologies, we achieve a high-performance, type-safe, and maintainable application architecture.",
        },
        {
          title: "Open Source & Sharing",
          content:
            "The project is fully open source and hosted on GitHub. Developers are welcome to learn and reference the code. If you have any questions or suggestions, feel free to submit an Issue or Pull Request.",
        },
      ],
      footer: "Thank you for visiting!",
    },
  };

  const currentContent = content[locale];

  return (
    <div ref={containerRef}>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Hero Section */}
        <header className="about-hero mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {currentContent.subtitle}
          </p>
        </header>

        {/* Content Sections */}
        <div className="space-y-16">
          {currentContent.sections.map((section, index) => (
            <section key={index} className="about-section">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
                {section.title}
              </h2>

              {"content" in section && section.content && (
                <p className="text-zinc-700 dark:text-zinc-300 leading-7 mb-8">
                  {section.content}
                </p>
              )}

              {"features" in section && section.features && (
                <ul className="space-y-4">
                  {section.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="feature-item flex items-start gap-4 text-zinc-700 dark:text-zinc-300 leading-relaxed"
                    >
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {"stack" in section && section.stack && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.stack.map((item, stackIndex) => (
                    <div
                      key={stackIndex}
                      className="stack-card p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        {item.category}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item.items}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
            {currentContent.footer}
          </p>
        </footer>
      </div>
    </div>
  );
}
