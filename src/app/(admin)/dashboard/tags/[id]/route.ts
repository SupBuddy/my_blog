'use server';

import { deleteTag } from '@/actions/admin-category';
import { redirect } from 'next/navigation';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(request: Request, context: RouteContext) {
  const tagId = parseInt(context.params.id, 10);
  
  if (tagId) {
    await deleteTag(tagId);
  }

  redirect('/dashboard/tags');
}