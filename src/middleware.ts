import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义受保护的路由
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // 如果是受保护的路由，强制要求认证
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|a?png|(?:a?svg|svg)a|webp|gif|mp4|mov|avi|mp3|wav|flac|ogg|wav|pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz|bz2|exe|dmg|iso|apk|ipa|swf|woff2?|ttf|eot|otf|ico|txt|rtf|md)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
