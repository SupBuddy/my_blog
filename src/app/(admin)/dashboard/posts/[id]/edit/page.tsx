import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EditPostForm from '@/components/admin/EditPostForm';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const postId = parseInt(params.id, 10);

  if (!postId) {
    redirect('/dashboard/posts');
  }

  return <EditPostForm postId={postId} />;
}