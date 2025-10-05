import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { LiveStats } from '@/components/landing/live-stats';
import { Testimonials } from '@/components/landing/testimonials';
import { Pricing } from '@/components/landing/pricing';
import { CTA } from '@/components/landing/cta';
import { Navigation } from '@/components/landing/navigation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Navigation />
      <Hero />
      <LiveStats />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}