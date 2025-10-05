'use client';

import { useEffect, useState } from 'react';
import { Users, Globe, Zap } from 'lucide-react';

export function LiveStats() {
  const [activeUsers, setActiveUsers] = useState(127);
  const [totalPortfolios, setTotalPortfolios] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live user count changing
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
      
      // Occasionally increment total portfolios
      if (Math.random() > 0.7) {
        setTotalPortfolios(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 border-y border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Live Now</span>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {activeUsers}
            </div>
            <div className="text-gray-400">Developers Building</div>
          </div>

          <div className="space-y-2">
            <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {totalPortfolios.toLocaleString()}
            </div>
            <div className="text-gray-400">Portfolios Created</div>
          </div>

          <div className="space-y-2">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              &lt; 5min
            </div>
            <div className="text-gray-400">Average Setup Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}