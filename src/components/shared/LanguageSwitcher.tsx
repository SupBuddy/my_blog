"use client";

import { Globe } from "lucide-react";
import type { Locale } from "@/lib/types";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const switchLocale = () => {
    // 切换到另一种语言
    const newLocale = currentLocale === "zh" ? "en" : "zh";
    
    // 获取当前路径，替换语言部分
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(zh|en)/, "");
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
      title={currentLocale === "zh" ? "切换到英文" : "切换到中文"}
    >
      <Globe className="w-4 h-4" />
      <span>{currentLocale === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}