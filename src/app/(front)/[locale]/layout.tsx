import { locales, type Locale } from "@/lib/types";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

// 验证 locale 参数
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 动态路由参数验证
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={params.locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={params.locale} />
    </div>
  );
}
