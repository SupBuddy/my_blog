"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { FileText, FolderOpen, Tags, Home, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  // 路由变化时自动关闭菜单
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (!isLoaded || !userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              Dashboard
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link
                href="/dashboard/posts"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <FileText className="w-4 h-4" />
                Posts
              </Link>
              <Link
                href="/dashboard/categories"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <FolderOpen className="w-4 h-4" />
                Categories
              </Link>
              <Link
                href="/dashboard/tags"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Tags className="w-4 h-4" />
                Tags
              </Link>
              <Link
                href="/zh"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Home className="w-4 h-4" />
                前台首页
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/dashboard/posts"
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-base font-medium">Posts</span>
                  </Link>
                  <Link
                    href="/dashboard/categories"
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <FolderOpen className="w-5 h-5" />
                    <span className="text-base font-medium">Categories</span>
                  </Link>
                  <Link
                    href="/dashboard/tags"
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Tags className="w-5 h-5" />
                    <span className="text-base font-medium">Tags</span>
                  </Link>
                  <Link
                    href="/zh"
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-zinc-600 transition-colors hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-base font-medium">前台首页</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
