'use client';

import { useState, useEffect } from 'react';
import { Home, User, Briefcase, Award, Mail, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Portfolio {
  username: string;
  display_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  cta_text: string | null;
  cta_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  image_url: string[] | null;
  demo_url: string | null;
  github_url: string | null;
}

interface Skill {
  id: string;
  name: string;
}

interface ModernDarkTemplateProps {
  portfolio: Portfolio;
  projects: Project[];
  skills: Skill[];
}

export function ModernDarkTemplate({ portfolio, projects, skills }: ModernDarkTemplateProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const displayName = portfolio.display_name || portfolio.username;
  const heroTitle = portfolio.hero_title || `It's Me ${displayName}`;
  const heroSubtitle = portfolio.hero_subtitle || portfolio.bio || '';
  const ctaText = portfolio.cta_text || 'Contact Me';
  const ctaUrl = portfolio.cta_url || (portfolio.email ? `mailto:${portfolio.email}` : '#');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-90 backdrop-blur-md border-b transition-colors duration-300"
        style={{
          backgroundColor: darkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Nav Icons */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => scrollToSection('home')}
                className={`p-2 rounded-lg transition-colors ${
                  activeSection === 'home' 
                    ? darkMode 
                      ? 'bg-white/10 text-white' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`p-2 rounded-lg transition-colors ${
                  activeSection === 'about' 
                    ? darkMode 
                      ? 'bg-white/10 text-white' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className={`p-2 rounded-lg transition-colors ${
                  activeSection === 'projects' 
                    ? darkMode 
                      ? 'bg-white/10 text-white' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('skills')}
                className={`p-2 rounded-lg transition-colors ${
                  activeSection === 'skills' 
                    ? darkMode 
                      ? 'bg-white/10 text-white' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Award className="w-5 h-5" />
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href={ctaUrl}>
                <Button 
                  className={`rounded-full ${
                    darkMode
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Section Indicators */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {['home', 'about', 'projects', 'skills'].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSection === section ? 'bg-white h-8' : 'bg-gray-600 hover:bg-gray-400'
            }`}
            title={section}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {portfolio.avatar_url && (
            <div className="mb-8">
              <img
                src={portfolio.avatar_url}
                alt={displayName}
                className="w-48 h-48 rounded-3xl mx-auto object-cover shadow-2xl"
              />
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {heroTitle}
          </h1>
          
          {portfolio.tagline && (
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              {portfolio.tagline}
            </p>
          )}

          {heroSubtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {heroSubtitle}
            </p>
          )}

          <div className="flex justify-center gap-4 flex-wrap">
            {portfolio.email && (
              <Link href={`mailto:${portfolio.email}`}>
                <Button variant="outline" className="rounded-full border-gray-600 hover:bg-gray-800">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-3xl mx-auto">
          <div className={`rounded-3xl p-12 ${darkMode ? 'bg-[#252525]' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">About</h2>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-8">
              More About Me
            </h3>
            
            {portfolio.bio && (
              <div className="text-gray-400 leading-relaxed space-y-4">
                {portfolio.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {portfolio.avatar_url && (
              <div className="mt-8">
                <img
                  src={portfolio.avatar_url}
                  alt={displayName}
                  className="w-full rounded-2xl object-cover"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="min-h-screen px-6 py-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">Portfolio</h2>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              My Side Projects
            </h3>
            
            <p className="text-gray-400 mb-16 max-w-2xl">
              I did passion side projects in the weekend, please take a look you will love it (i hope).
            </p>

            <div className="space-y-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={project.demo_url || project.github_url || '#'}
                  target="_blank"
                >
                  <div className={`rounded-3xl p-8 transition-all hover:scale-[1.02] cursor-pointer ${
                    darkMode ? 'bg-[#252525] hover:bg-[#2a2a2a]' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        {project.image_url && project.image_url[0] && (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                            <img
                              src={project.image_url[0]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div>
                          <h4 className="text-2xl font-semibold mb-2">{project.title}</h4>
                          {project.tech_stack && project.tech_stack.length > 0 && (
                            <p className="text-gray-500 text-sm uppercase tracking-wider">
                              {project.tech_stack.join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="min-h-screen px-6 py-32">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">Skills</h2>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-16">
              What I Work With
            </h3>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    darkMode ? 'bg-[#252525] hover:bg-[#2a2a2a]' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="px-6 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Let's work together.
          </h3>
          <p className="text-gray-400 mb-8 text-lg">
            Creating user experience and visual appealing design
          </p>
          <Link href={ctaUrl}>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full">
              <Mail className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-500 text-sm"
        style={{ borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
      >
        <p>© 2025 {displayName}. Built with CodePortfolio.</p>
      </footer>
    </div>
  );
}