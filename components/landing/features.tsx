import { Sparkles, Palette, Zap, Shield, Code, Globe } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Setup',
      description: 'Create your portfolio in under 5 minutes. No coding required.',
    },
    {
      icon: Palette,
      title: 'Beautiful Templates',
      description: 'Modern, responsive designs that make your work stand out.',
    },
    {
      icon: Code,
      title: 'Drag & Drop Projects',
      description: 'Easily add and reorder your projects with simple drag and drop.',
    },
    {
      icon: Globe,
      title: 'Custom Domain Ready',
      description: 'Use your own domain or our free subdomain. Your choice.',
    },
    {
      icon: Shield,
      title: 'Always Online',
      description: '99.9% uptime. Your portfolio is always accessible.',
    },
    {
      icon: Sparkles,
      title: 'SEO Optimized',
      description: 'Built-in SEO so recruiters can find you on Google.',
    },
  ];

  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professional features that help you showcase your work and land your dream job
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <feature.icon className="w-12 h-12 mb-4 text-blue-400" />
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}