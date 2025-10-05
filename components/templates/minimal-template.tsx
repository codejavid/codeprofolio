import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    category: string | null;
}

interface MinimalTemplateProps {
    portfolio: Portfolio;
    projects: Project[];
    skills: Skill[];
}

export function MinimalTemplate({ portfolio, projects, skills }: MinimalTemplateProps) {
    const displayName = portfolio.display_name || portfolio.username;
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const primaryColor = portfolio.primary_color || '#4F46E5';
    const secondaryColor = portfolio.secondary_color || '#7C3AED';
    const accentColor = portfolio.accent_color || '#EC4899';

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
                            {displayName}
                        </h1>
                        <div className="text-sm text-gray-500">
                            {portfolio.username}.codeportfolio.io
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="border-b bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Avatar */}
                        {portfolio.avatar_url ? (
                            <img
                                src={portfolio.avatar_url}
                                alt={displayName}
                                className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
                                style={{ borderColor: primaryColor }}
                            />
                        ) : (
                            <div
                                className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {initials}
                            </div>
                        )}

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {displayName}
                        </h2>

                        {portfolio.tagline && (
                            <p className="text-xl text-gray-600 mb-8">
                                {portfolio.tagline}
                            </p>
                        )}

                        {portfolio.bio && (
                            <p className="text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
                                {portfolio.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        <div className="flex justify-center gap-4 flex-wrap">
                            {portfolio.email && (
                                <Link href={`mailto:${portfolio.email}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        style={{ borderColor: primaryColor, color: primaryColor }}
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </Button>
                                </Link>
                            )}
                            {portfolio.github_url && (
                                <Link href={portfolio.github_url} target="_blank">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        style={{ borderColor: primaryColor, color: primaryColor }}
                                    >
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </Button>
                                </Link>
                            )}
                            {portfolio.linkedin_url && (
                                <Link href={portfolio.linkedin_url} target="_blank">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        style={{ borderColor: primaryColor, color: primaryColor }}
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </Button>
                                </Link>
                            )}
                            {portfolio.twitter_url && (
                                <Link href={portfolio.twitter_url} target="_blank">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        style={{ borderColor: primaryColor, color: primaryColor }}
                                    >
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            {/* Projects Section */}
            {projects && projects.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-5xl"> {/* Changed from max-w-6xl */}
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Projects
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"> {/* Changed from lg:grid-cols-3 gap-6 max-w-6xl */}
                            {projects.map((project) => (
                                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                                    {project.image_url && project.image_url.length > 0 && (
                                        <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
                                            <img
                                                src={project.image_url[0]}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-6">
                                        <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
                                        {project.description && (
                                            <p className="text-gray-600 mb-4">
                                                {project.description}
                                            </p>
                                        )}

                                        {project.tech_stack && project.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tech_stack.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 text-xs rounded-md"
                                                        style={{
                                                            backgroundColor: `${primaryColor}20`,
                                                            color: primaryColor
                                                        }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            {project.demo_url && (
                                                <Link href={project.demo_url} target="_blank">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        style={{ borderColor: primaryColor, color: primaryColor }}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Demo
                                                    </Button>
                                                </Link>
                                            )}
                                            {project.github_url && (
                                                <Link href={project.github_url} target="_blank">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        style={{ borderColor: primaryColor, color: primaryColor }}
                                                    >
                                                        <Github className="w-4 h-4" />
                                                        Code
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {skills && skills.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Skills
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="px-4 py-2 bg-white border rounded-full text-gray-700 font-medium shadow-sm hover:shadow-md transition-shadow"
                                    style={{ borderColor: `${primaryColor}40` }}
                                >
                                    {skill.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© 2025 {displayName}. Built with CodePortfolio.</p>
                </div>
            </footer>
        </div>
    );
}