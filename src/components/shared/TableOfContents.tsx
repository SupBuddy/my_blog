'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 从内容中提取标题
  useEffect(() => {
    const extractHeadings = () => {
      const headingRegex = /<h([2-6])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
      const matches: TOCItem[] = [];
      let match;

      while ((match = headingRegex.exec(content)) !== null) {
        matches.push({
          level: parseInt(match[1]),
          id: match[2],
          text: match[3].replace(/<[^>]+>/g, ''), // Remove HTML tags from text
        });
      }

      setHeadings(matches);
    };

    extractHeadings();
  }, [content]);

  // 滚动监听，高亮当前标题
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    const headingElements = document.querySelectorAll('h2, h3, h4, h5, h6');
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-left transition-colors line-clamp-2 ${
                activeId === heading.id
                  ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}