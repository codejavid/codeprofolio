import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Pricing() {
  return (
    <section id="pricing" className="py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-5xl font-bold mb-6">
              $0
              <span className="text-lg text-gray-400">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span>1 Portfolio</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span>Unlimited Projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span>Modern Templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span>Custom Subdomain</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span>SEO Optimized</span>
              </li>
            </ul>
            <Link href="/login">
              <Button className="w-full text-black" variant="outline">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-5xl font-bold mb-6">
              $9
              <span className="text-lg text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="font-semibold">Everything in Free, plus:</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>Unlimited Portfolios</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>Custom Domain</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>GitHub Auto-Import</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>AI Job Recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>Advanced Analytics</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" disabled>
              Launching Q2 2025
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}