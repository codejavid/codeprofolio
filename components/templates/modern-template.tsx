'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Twitter, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Portfolio {
  username: string;
  display_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
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

interface ModernTemplateProps {
  portfolio: Portfolio;
  projects: Project[];
  skills: Skill[];
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ModernTemplate({ portfolio, projects, skills }: ModernTemplateProps) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const displayName = portfolio.display_name || portfolio.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            {portfolio.avatar_url ? (
              <img
                src={portfolio.avatar_url}
                alt={displayName}
                className="w-32 h-32 rounded-full mx-auto border-4 border-purple-500 shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto border-4 border-purple-500 shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold">
                {displayName.charAt(0)}
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          >
            {displayName}
          </motion.h1>

          {portfolio.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-purple-300 mb-8 font-light"
            >
              {portfolio.tagline}
            </motion.p>
          )}

          {portfolio.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              {portfolio.bio}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            {portfolio.email && (
              <Link href={`mailto:${portfolio.email}`}>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </Button>
              </Link>
            )}
            {portfolio.github_url && (
              <Link href={portfolio.github_url} target="_blank">
                <Button size="lg" variant="outline" className="border-purple-500 text-white hover:bg-purple-500/20 gap-2">
                  <Github className="w-5 h-5" />
                  GitHub
                </Button>
              </Link>
            )}
            {portfolio.linkedin_url && (
              <Link href={portfolio.linkedin_url} target="_blank">
                <Button size="lg" variant="outline" className="border-purple-500 text-white hover:bg-purple-500/20 gap-2">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </Button>
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, repeat: Infinity, duration: 2, repeatType: "reverse" }}
            className="mt-20"
          >
            <ArrowRight className="w-8 h-8 mx-auto rotate-90 text-purple-400" />
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="relative py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Featured Work
              </h2>
            </FadeInSection>

            <div className="space-y-32">
              {projects.map((project, index) => (
                <FadeInSection key={project.id} delay={index * 0.2}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`grid md:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Project Image */}
                    {project.image_url && project.image_url.length > 0 && (
                      <div className={`relative group ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative rounded-2xl overflow-hidden">
                          <img
                            src={project.image_url[0]}
                            alt={project.title}
                            className="w-full aspect-video object-cover transform group-hover:scale-105 transition duration-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Project Info */}
                    <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                      <h3 className="text-4xl font-bold mb-4 text-white">{project.title}</h3>
                      {project.description && (
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech_stack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4">
                        {project.demo_url && (
                          <Link href={project.demo_url} target="_blank">
                            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Live Demo
                            </Button>
                          </Link>
                        )}
                        {project.github_url && (
                          <Link href={project.github_url} target="_blank">
                            <Button variant="outline" className="border-purple-500 text-white hover:bg-purple-500/20 gap-2">
                              <Github className="w-4 h-4" />
                              View Code
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="relative py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <FadeInSection>
              <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Skills & Technologies
              </h2>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="flex flex-wrap justify-center gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-full text-white font-medium backdrop-blur-sm"
                  >
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative border-t border-purple-500/20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 {displayName}. Powered by CodePortfolio.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}