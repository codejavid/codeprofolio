import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Plus, Edit, Eye, MoreVertical } from 'lucide-react';
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { createClient } from '@/lib/supabase/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeletePortfolioButton } from '@/components/portfolio/delete-portfolio-button';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
              CodePortfolio
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <AvatarDisplay
                src={session.user.user_metadata.avatar_url || session.user.user_metadata.picture}
                name={profile?.full_name || session.user.user_metadata.full_name}
                email={session.user.email}
                size="md"
              />
              <div>
                <div className="font-medium text-sm">
                  {profile?.full_name || session.user.user_metadata.full_name || session.user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-gray-500">{session.user.email}</div>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back,{' '}
            {profile?.full_name?.split(' ')[0] ||
              session.user.user_metadata.full_name?.split(' ')[0] ||
              session.user.email?.split('@')[0]}
            ! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {portfolios && portfolios.length > 0
              ? 'Here are your portfolios. Keep building!'
              : 'Ready to create your first portfolio?'}
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Portfolio Card */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
            <CardHeader className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Create Portfolio</CardTitle>
              <CardDescription>Start building your portfolio in minutes</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Link href="/create-portfolio">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Existing Portfolios */}
          {portfolios?.map((portfolio) => (
            <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-1">
                      {portfolio.display_name || 'Untitled Portfolio'}
                    </CardTitle>
                    <CardDescription>{portfolio.username}.codeportfolio.io</CardDescription>
                  </div>

                  {/* Three-dot Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/editor/${portfolio.id}`} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Portfolio
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/${portfolio.username}`}
                          target="_blank"
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Live
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeletePortfolioButton
                        portfolioId={portfolio.id}
                        portfolioName={portfolio.display_name || portfolio.username}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Link href={`/editor/${portfolio.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/${portfolio.username}`} target="_blank" className="flex-1">
                    <Button size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>

                <div className="text-sm text-gray-600">{portfolio.views_count || 0} views</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(!portfolios || portfolios.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No portfolios yet</h3>
            <p className="text-gray-600 mb-6">Create your first portfolio to get started</p>
            <Link href="/create-portfolio">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Portfolio
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}