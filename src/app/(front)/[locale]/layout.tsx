import { locales, type Locale } from "@/lib/types";

// 验证 locale 参数
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 动态路由参数验证
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
