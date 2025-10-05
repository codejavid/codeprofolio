import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ModernDarkTemplate } from '@/components/templates/modern-dark-template';
import { MinimalTemplate } from '@/components/templates/minimal-template';
import { ModernTemplate } from '@/components/templates/modern-template';
import { CreativeTemplate } from '@/components/templates/creative-template';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ username: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('display_name, tagline, username')
    .eq('username', username)
    .eq('is_published', true)
    .single();

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    };
  }

  return {
    title: `${portfolio.display_name || portfolio.username} - Portfolio`,
    description: portfolio.tagline || `Check out ${portfolio.display_name}'s portfolio`,
    openGraph: {
      title: `${portfolio.display_name || portfolio.username} - Portfolio`,
      description: portfolio.tagline || '',
    },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get portfolio
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('username', username)
    .eq('is_published', true)
    .single();

  if (!portfolio) {
    notFound();
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

  // Increment view count
  await supabase
    .from('portfolios')
    .update({ views_count: (portfolio.views_count || 0) + 1 })
    .eq('id', portfolio.id);

  // Render template based on template_id
  return (
    <ModernDarkTemplate
      portfolio={portfolio}
      projects={projects || []}
      skills={skills || []}
    />
  );
}