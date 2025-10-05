'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CodePortfolio
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-white hover:text-blue-400 transition-colors font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-white hover:text-blue-400 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}