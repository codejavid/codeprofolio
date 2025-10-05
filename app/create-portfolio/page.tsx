import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreatePortfolioForm } from '@/components/portfolio/create-portfolio-form';

export default async function CreatePortfolioPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <CreatePortfolioForm userId={session.user.id} />
    </div>
  );
}