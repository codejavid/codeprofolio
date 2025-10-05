import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { EditorContent } from '@/components/portfolio/editor-content';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  // Await params
  const { id } = await params;
  
  // Await cookies
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Get portfolio
  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single();

  if (error || !portfolio) {
    redirect('/dashboard');
  }

  // Get projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('portfolio_id', portfolio.id)
    .order('display_order', { ascending: true });

  // Get skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('portfolio_id', portfolio.id);

  return (
    <EditorContent
      portfolio={portfolio}
      projects={projects || []}
      skills={skills || []}
      userId={session.user.id}
    />
  );
}