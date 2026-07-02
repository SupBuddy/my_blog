'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 获取当前用户信息
export async function getCurrentUser() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  // 查询数据库中的用户
  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, clerkUser.emailAddresses[0]?.emailAddress),
  });

  return {
    id: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    role: dbUser?.role || 'admin',
  };
}

// 同步 Clerk 用户到数据库（首次登录时）
export async function syncUserToDatabase() {
  const { userId } = auth();
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return { success: false, error: 'User not found' };
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return { success: false, error: 'Email not found' };
  }

  try {
    // 检查用户是否已存在
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { success: true, data: existingUser };
    }

    // 创建新用户
    const newUser = await db.insert(users).values({
      email,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      role: 'admin',
    }).returning();

    return { success: true, data: newUser[0] };
  } catch (error) {
    console.error('Error syncing user:', error);
    return { success: false, error: 'Failed to sync user' };
  }
}