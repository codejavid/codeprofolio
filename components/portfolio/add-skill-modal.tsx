'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: string;
}

export function AddSkillModal({ open, onOpenChange, portfolioId }: AddSkillModalProps) {
  const [loading, setLoading] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('skills').insert({
        portfolio_id: portfolioId,
        name: skillName.trim(),
        category: category.trim() || null,
      });

      if (error) throw error;

      toast.success('Skill added! ✓');
      setSkillName('');
      setCategory('');
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogDescription>
            Add a new skill to your portfolio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name *</Label>
            <Input
              id="skillName"
              placeholder="React, Node.js, Python..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="Frontend, Backend, Tools..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Skill'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}