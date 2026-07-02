"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 客户端语法高亮（简化版，使用纯文本 + CSS 样式）
    // 生产环境应该使用 Shiki 进行静态高亮
    setHighlightedCode(code);
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative my-6 rounded-lg border border-zinc-200 bg-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 dark:bg-zinc-900 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-sm text-zinc-400 font-medium">{filename}</span>
          )}
          <span className="text-xs text-zinc-500 uppercase">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-zinc-400 hover:text-white"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm text-zinc-100 font-mono leading-relaxed">
          <code className={`language-${language}`}>{highlightedCode}</code>
        </pre>
      </div>
    </div>
  );
}