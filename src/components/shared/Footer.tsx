import Link from 'next/link';
import type { Locale } from '@/lib/types';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link 
              href={`/${locale}`} 
              className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              My Blog
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              A modern full-stack blog built with Next.js 14+
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Links
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href={`/${locale}`}
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Home
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Social
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Twitter
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Tech Stack
            </h3>
            <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Next.js 14</span>
              <span>TypeScript</span>
              <span>Drizzle ORM</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}