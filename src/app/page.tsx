import { redirect } from 'next/navigation';

/**
 * Root page - redirects to default locale (zh)
 * 访问根路径时自动重定向到默认语言
 */
export default function RootPage() {
  redirect('/zh');
}