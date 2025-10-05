'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create waves with depth
    const waves: Array<{
      y: number;
      length: number;
      amplitude: number;
      frequency: number;
      speed: number;
      color: string;
      opacity: number;
    }> = [];

    // Multiple wave layers for depth
    for (let i = 0; i < 5; i++) {
      waves.push({
        y: canvas.height * 0.3 + i * 80,
        length: 0.01 + i * 0.001,
        amplitude: 50 + i * 10,
        frequency: 0.01 + i * 0.002,
        speed: 0.02 + i * 0.005,
        color: ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981'][i],
        opacity: 0.15 - i * 0.02,
      });
    }

    let increment = 0;

    // Floating orbs
    const orbs: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      glow: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 20,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: ['#8B5CF6', '#3B82F6', '#06B6D4', '#10B981'][Math.floor(Math.random() * 4)],
        glow: Math.random() * 20 + 10,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e1b4b');
      gradient.addColorStop(0.5, '#581c87');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbs with glow
      orbs.forEach((orb) => {
        // Create radial gradient for glow effect
        const orbGradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius + orb.glow
        );
        orbGradient.addColorStop(0, orb.color + '60');
        orbGradient.addColorStop(0.5, orb.color + '20');
        orbGradient.addColorStop(1, orb.color + '00');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius + orb.glow, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();

        // Move orbs
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Pulse glow
        orb.glow = 10 + Math.sin(increment * 0.05) * 10;

        // Bounce off edges
        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1;
      });

      // Draw flowing waves
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x < canvas.width; x++) {
          const y =
            wave.y +
            Math.sin(x * wave.length + increment * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency + increment * wave.speed * 0.5) * (wave.amplitude * 0.5);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(0, wave.y, 0, canvas.height);
        waveGradient.addColorStop(0, wave.color + Math.floor(wave.opacity * 255).toString(16).padStart(2, '0'));
        waveGradient.addColorStop(1, wave.color + '00');

        ctx.fillStyle = waveGradient;
        ctx.fill();
      });

      // Draw grid with perspective
      ctx.strokeStyle = '#8B5CF620';
      ctx.lineWidth = 1;

       // Horizontal lines with perspective
       for (let i = 0; i < 20; i++) {
         const y = canvas.height * 0.5 + i * 40;
         ctx.beginPath();
         ctx.moveTo(0, y);
         ctx.lineTo(canvas.width, y);
         ctx.stroke();
       }

      // Vertical lines
      for (let i = 0; i < 30; i++) {
        const x = (i * canvas.width) / 30;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height * 0.5);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      increment += 0.5;
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Join 2,847 developers showcasing their work</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight animate-fade-in">
            Build Your Dream
            <br />
            Portfolio in Minutes
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Create a stunning portfolio that stands out. No coding required. Just add your projects and publish.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-6 font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            ✨ Free forever • No credit card required • Publish instantly
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
}