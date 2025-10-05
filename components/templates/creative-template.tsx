'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Mail, ExternalLink, Sparkles } from 'lucide-react';
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

interface CreativeTemplateProps {
  portfolio: Portfolio;
  projects: Project[];
  skills: Skill[];
}

export function CreativeTemplate({ portfolio, projects, skills }: CreativeTemplateProps) {
  const displayName = portfolio.display_name || portfolio.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Hero Section with Bento Grid */}
      <section className="min-h-screen p-4 md:p-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {/* Name Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-8 flex flex-col justify-center text-white shadow-2xl"
            >
              <Sparkles className="w-12 h-12 mb-4" />
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{displayName}</h1>
              {portfolio.tagline && (
                <p className="text-2xl md:text-3xl font-light opacity-90">{portfolio.tagline}</p>
              )}
            </motion.div>

            {/* Avatar Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl"
            >
              {portfolio.avatar_url ? (
                <img
                  src={portfolio.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-6xl font-bold">
                  {displayName.charAt(0)}
                </div>
              )}
            </motion.div>

            {/* Bio Card */}
            {portfolio.bio && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 bg-white rounded-3xl p-6 shadow-xl"
              >
                <p className="text-gray-700 text-lg leading-relaxed">{portfolio.bio}</p>
              </motion.div>
            )}

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl p-6 flex flex-col justify-center gap-3 shadow-xl"
            >
              {portfolio.email && (
                <Link href={`mailto:${portfolio.email}`} className="group">
                  <div className="flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform">
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Email</span>
                  </div>
                </Link>
              )}
              {portfolio.github_url && (
                <Link href={portfolio.github_url} target="_blank" className="group">
                  <div className="flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform">
                    <Github className="w-5 h-5" />
                    <span className="font-medium">GitHub</span>
                  </div>
                </Link>
              )}
              {portfolio.linkedin_url && (
                <Link href={portfolio.linkedin_url} target="_blank" className="group">
                  <div className="flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform">
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">LinkedIn</span>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Masonry Grid */}
      {projects && projects.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Creative Work
            </h2>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                    {project.image_url && project.image_url.length > 0 && (
                      <div className="relative aspect-video overflow-hidden group">
                        <img
                          src={project.image_url[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 mb-4">{project.description}</p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {project.demo_url && (
                          <Link href={project.demo_url} target="_blank">
                            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Demo
                            </Button>
                          </Link>
                        )}
                        {project.github_url && (
                          <Link href={project.github_url} target="_blank">
                            <Button size="sm" variant="outline">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Floating Cards */}
      {skills && skills.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              My Toolkit
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, rotate: -10 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className="px-5 py-3 bg-white rounded-2xl shadow-lg text-gray-800 font-semibold border-2 border-transparent hover:border-pink-400 transition-all"
                >
                  {skill.name}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600">
        <p>© 2025 {displayName}. Built with CodePortfolio.</p>
      </footer>
    </div>
  );
}