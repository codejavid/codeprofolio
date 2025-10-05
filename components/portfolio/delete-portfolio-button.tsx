'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface DeletePortfolioButtonProps {
  portfolioId: string;
  portfolioName: string;
}

export function DeletePortfolioButton({ portfolioId, portfolioName }: DeletePortfolioButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleDelete = async () => {
    const confirmed = confirm(
      `Delete "${portfolioName}"?\n\nThis will permanently delete the portfolio and all its projects and skills. This cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) throw error;

      toast.success('Portfolio deleted');
      router.refresh();
    } catch (error: any) {
      console.error('Error deleting portfolio:', error);
      toast.error('Failed to delete portfolio');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DropdownMenuItem
      className="text-red-600 focus:text-red-600 cursor-pointer"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Portfolio
        </>
      )}
    </DropdownMenuItem>
  );
}