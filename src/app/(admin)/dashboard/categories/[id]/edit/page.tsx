import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EditCategoryForm from '@/components/admin/EditCategoryForm';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const categoryId = parseInt(params.id, 10);

  if (!categoryId) {
    redirect('/dashboard/categories');
  }

  return <EditCategoryForm categoryId={categoryId} />;
}