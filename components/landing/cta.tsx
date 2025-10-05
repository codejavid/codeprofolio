import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-3xl p-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Stand Out?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who've already built their dream portfolio. Get started in minutes, for free.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-10 py-7">
              Create Your Portfolio Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6">
            No credit card required • Free forever • Takes less than 5 minutes
          </p>
        </div>
      </div>

      <footer className="mt-20 text-center text-gray-500 text-sm border-t border-white/10 pt-8">
        <p>© 2025 CodePortfolio. Built with ❤️ for developers.</p>
      </footer>
    </section>
  );
}