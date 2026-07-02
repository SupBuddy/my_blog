import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EditTagForm from '@/components/admin/EditTagForm';

interface EditTagPageProps {
  params: {
    id: string;
  };
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const tagId = parseInt(params.id, 10);

  if (!tagId) {
    redirect('/dashboard/tags');
  }

  return <EditTagForm tagId={tagId} />;
}