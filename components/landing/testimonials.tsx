'use client';

import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer',
      company: 'Google',
      image: 'https://i.pravatar.cc/150?img=1',
      quote: 'CodePortfolio helped me land my dream job at Google. The process was so simple, and the result looks amazing!',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Full-Stack Engineer',
      company: 'Meta',
      image: 'https://i.pravatar.cc/150?img=12',
      quote: 'I built my portfolio in 10 minutes. Got 3 interview requests within a week. Absolutely worth it.',
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'UI/UX Designer',
      company: 'Adobe',
      image: 'https://i.pravatar.cc/150?img=5',
      quote: 'The templates are gorgeous. I customized mine with my brand colors and it looks professional.',
      rating: 5,
    },
    {
      name: 'James Kim',
      role: 'Software Engineer',
      company: 'Amazon',
      image: 'https://i.pravatar.cc/150?img=14',
      quote: 'Best investment for my career. Recruiters love how clean and professional my portfolio looks.',
      rating: 5,
    },
    {
      name: 'Lisa Zhang',
      role: 'Product Designer',
      company: 'Spotify',
      image: 'https://i.pravatar.cc/150?img=9',
      quote: 'Finally, a portfolio builder that doesn\'t look generic. My work actually stands out now.',
      rating: 5,
    },
    {
      name: 'David Brown',
      role: 'Backend Developer',
      company: 'Netflix',
      image: 'https://i.pravatar.cc/150?img=13',
      quote: 'Super easy to use. I updated my portfolio every month with new projects. Highly recommend!',
      rating: 5,
    },
  ];

  return (
    <section className="py-32 bg-black/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Loved by Developers
          </h2>
          <p className="text-xl text-gray-400">
            Join thousands of developers who landed their dream jobs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}