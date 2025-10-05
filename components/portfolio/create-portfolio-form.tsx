'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface CreatePortfolioFormProps {
  userId: string;
}

export function CreatePortfolioForm({ userId }: CreatePortfolioFormProps) {
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedTemplate] = useState<'minimal'>('minimal');

  const router = useRouter();
  const supabase = createClientComponentClient();

  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) {
      setAvailable(null);
      return;
    }
  
    setChecking(true);
  
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('username')
        .eq('username', value)
        .maybeSingle(); // Use maybeSingle instead of single
  
      // If data exists, username is taken
      // If data is null, username is available
      setAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setUsername(cleaned);
    checkUsername(cleaned);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !available) {
      toast.error('Please choose a valid username');
      return;
    }

    setCreating(true);

    try {
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: userId,
          username: username,
          template_id: selectedTemplate,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Portfolio created!');
      router.push(`/editor/${portfolio.id}`);
    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      toast.error(error.message || 'Failed to create portfolio');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <CardTitle>Create Portfolio</CardTitle>
        </div>
        <CardDescription>Choose a username for your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="yourname"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                minLength={3}
                maxLength={30}
                required
              />
              {checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              {!checking && available === true && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Your portfolio will be available at:{' '}
              <span className="font-medium">
                {username || 'yourname'}.codeportfolio.io
              </span>
            </p>
            {available === false && (
              <p className="text-sm text-red-600">Username is already taken</p>
            )}
            {available === true && (
              <p className="text-sm text-green-600">Username is available!</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="border-2 rounded-lg p-4 border-blue-500 bg-blue-50"
              >
                <div className="text-sm font-medium mb-2">Minimal</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-300 rounded"></div>
                  <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                </div>
              </button>

              <button
                type="button"
                disabled
                className="border-2 rounded-lg p-4 border-gray-200 bg-gray-50 opacity-60 relative"
              >
                <div className="absolute top-2 right-2 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                  Soon
                </div>
                <div className="text-sm font-medium mb-2 text-gray-500">Modern</div>
                <div className="space-y-1 bg-gradient-to-r from-purple-200 to-pink-200 p-2 rounded opacity-50">
                  <div className="h-1 bg-white/50 rounded"></div>
                  <div className="h-1 bg-white/50 rounded w-2/3"></div>
                </div>
              </button>

              <button
                type="button"
                disabled
                className="border-2 rounded-lg p-4 border-gray-200 bg-gray-50 opacity-60 relative"
              >
                <div className="absolute top-2 right-2 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                  Soon
                </div>
                <div className="text-sm font-medium mb-2 text-gray-500">Creative</div>
                <div className="grid grid-cols-2 gap-1 opacity-50">
                  <div className="h-4 bg-orange-200 rounded"></div>
                  <div className="h-4 bg-pink-200 rounded"></div>
                  <div className="h-4 bg-purple-200 rounded col-span-2"></div>
                </div>
              </button>
            </div>
            <p className="text-xs text-gray-500">
              More templates coming soon! Start with Minimal and switch later.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!available || creating}
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Portfolio'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}