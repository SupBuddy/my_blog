import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/types";
import { LayoutDashboard } from "lucide-react";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-80 dark:text-zinc-100"
          >
            My Blog
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher currentLocale={locale} />
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href={`/${locale}`}
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {locale === "zh" ? "首页" : "Home"}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {locale === "zh" ? "关于" : "About"}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-opacity hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-900">
                {locale === "zh" ? "登录" : "Sign In"}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <LayoutDashboard className="w-4 h-4" />
              {locale === "zh" ? "后台" : "Dashboard"}
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
