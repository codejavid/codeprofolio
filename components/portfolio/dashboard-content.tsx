'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { CreatePortfolioModal } from './create-portfolio-modal';
import Link from 'next/link';

interface Portfolio {
  id: string;
  username: string;
  display_name: string | null;
  views_count: number;
}

interface DashboardContentProps {
  userId: string;
  portfolios: Portfolio[] | null;
}

export function DashboardContent({ userId, portfolios }: DashboardContentProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => setShowCreateModal(true)}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <PlusCircle className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Create Portfolio</CardTitle>
            <CardDescription>Start building your portfolio in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        {/* Existing Portfolios */}
        {portfolios?.map((portfolio) => (
          <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="truncate">
                {portfolio.display_name || 'Untitled Portfolio'}
              </CardTitle>
              <CardDescription className="truncate">
                {portfolio.username}.codeportfolio.io
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link href={`/editor/${portfolio.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Edit
                  </Button>
                </Link>
                <Link href={`/${portfolio.username}`} className="flex-1">
                  <Button className="w-full" size="sm">
                    View
                  </Button>
                </Link>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {portfolio.views_count || 0} views
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!portfolios || portfolios.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <PlusCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No portfolios yet</h3>
          <p className="text-gray-600 mb-6">Create your first portfolio to get started!</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Your First Portfolio
          </Button>
        </div>
      )}

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        userId={userId}
      />
    </>
  );
}