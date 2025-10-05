'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface CreatePortfolioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function CreatePortfolioModal({ open, onOpenChange, userId }: CreatePortfolioModalProps) {
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'minimal' | 'modern' | 'creative'>('minimal');
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Check username availability
  const checkUsername = async (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setUsername(sanitized);

    if (sanitized.length < 3) {
      setAvailable(null);
      return;
    }

    setChecking(true);

    const { data, error } = await supabase
      .from('portfolios')
      .select('username')
      .eq('username', sanitized)
      .single();

    setChecking(false);
    setAvailable(!data);
  };

  // Create portfolio
  const handleCreate = async () => {
    if (!available || username.length < 3) {
      toast.error('Please choose a valid username');
      return;
    }

    setCreating(true);

    try {
      // Create portfolio
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: userId,
          username: username,
          template_id: selectedTemplate, // Use selected template
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Portfolio created! 🎉');
      onOpenChange(false);

      // Redirect to editor
      router.push(`/editor/${portfolio.id}`);
      router.refresh();
    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      toast.error(error.message || 'Failed to create portfolio');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Portfolio</DialogTitle>
          <DialogDescription>
            Choose a unique username for your portfolio URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => checkUsername(e.target.value)}
                className="pr-10"
                maxLength={30}
                disabled={creating}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                {!checking && available === true && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {!checking && available === false && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            {username && (
              <p className="text-sm text-gray-500">
                Your URL: <span className="font-medium">{username}.codeportfolio.io</span>
              </p>
            )}

            {available === false && (
              <p className="text-sm text-red-500">Username already taken</p>
            )}
            {available === true && (
              <p className="text-sm text-green-600">Username available! ✓</p>
            )}
          </div>

          {/* Template Preview (Simple for now) */}
          <div className="space-y-2">
            <Label>Choose Template</Label>
            <div className="grid grid-cols-3 gap-3">
              {/* Minimal - Active */}
              <button
                type="button"
                onClick={() => setSelectedTemplate('minimal')}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === 'minimal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-sm font-medium mb-2">Minimal</div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-300 rounded"></div>
                  <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                </div>
              </button>

              {/* Modern - Coming Soon */}
              <button
                type="button"
                disabled
                className="border-2 rounded-lg p-4 cursor-not-allowed transition-all border-gray-200 bg-gray-50 opacity-60 relative"
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

              {/* Creative - Coming Soon */}
              <button
                type="button"
                disabled
                className="border-2 rounded-lg p-4 cursor-not-allowed transition-all border-gray-200 bg-gray-50 opacity-60 relative"
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
            <p className="text-xs text-gray-500 mt-2">
              More templates coming soon! Start with Minimal and switch later.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!available || creating || username.length < 3}
            className="flex-1"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}