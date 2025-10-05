'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
    User,
    Briefcase,
    Award,
    Plus,
    ArrowLeft,
    Globe,
    Eye,
    Loader2,
    Palette,
    Check,
    ArrowRight,
    Trash2,
} from 'lucide-react';
import { AddProjectModal } from './add-project-modal';
import { AddSkillModal } from './add-skill-modal';
import { EditProjectModal } from './edit-project-modal';
import { DeleteProjectDialog } from './delete-project-dialog';
import { SortableProjectsList } from './sortable-projects-list';
import { ColorPicker } from './color-picker';

interface Portfolio {
    id: string;
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
    is_published: boolean;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
}

interface Project {
    id: string;
    title: string;
    description: string | null;
    image_url: string[] | null;
    tech_stack: string[] | null;
    demo_url: string | null;
    github_url: string | null;
    display_order: number;
}

interface Skill {
    id: string;
    name: string;
}

interface EditorContentProps {
    portfolio: Portfolio;
    projects: Project[];
    skills: Skill[];
    userId: string;
}

export function EditorContent({
    portfolio: initialPortfolio,
    projects: initialProjects,
    skills: initialSkills,
    userId,
}: EditorContentProps) {
    const [portfolio, setPortfolio] = useState(initialPortfolio);
    const projects = initialProjects;
    const skills = initialSkills;
    const [saving, setSaving] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<{ id: string; title: string } | null>(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [completionStatus, setCompletionStatus] = useState({
        profile: false,
        projects: false,
        skills: false,
        theme: false,
    });
    const [validationErrors, setValidationErrors] = useState({
        displayName: '',
        tagline: '',
        projects: '',
        skills: '',
    });

    const router = useRouter();
    const supabase = createClientComponentClient();

    // Auto-save debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (portfolio.display_name || portfolio.tagline || portfolio.bio) {
                handleSaveProfile();
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [portfolio.display_name, portfolio.tagline, portfolio.bio, portfolio.hero_title, portfolio.hero_subtitle, portfolio.email, portfolio.github_url, portfolio.linkedin_url, portfolio.twitter_url]);

    // Check completion status
    useEffect(() => {
        setCompletionStatus({
            profile: !!(portfolio.display_name && portfolio.tagline),
            projects: initialProjects.length >= 1,
            skills: initialSkills.length >= 3,
            theme: true,
        });
    }, [portfolio, initialProjects.length, initialSkills.length]);

    const validateProfile = () => {
        const errors = {
            displayName: '',
            tagline: '',
            projects: '',
            skills: '',
        };

        if (!portfolio.display_name?.trim()) {
            errors.displayName = 'Display name is required';
        }

        if (!portfolio.tagline?.trim()) {
            errors.tagline = 'Tagline is required to showcase your role';
        }

        if (projects.length === 0) {
            errors.projects = 'Add at least one project to showcase your work';
        }

        if (skills.length < 3) {
            errors.skills = `Add ${3 - skills.length} more skill${skills.length === 2 ? '' : 's'} (minimum 3 required)`;
        }

        setValidationErrors(errors);
        return errors;
    };

    const canMoveToProjects = portfolio.display_name?.trim() && portfolio.tagline?.trim();
    const canMoveToSkills = projects.length >= 1;
    const canMoveToTheme = skills.length >= 3;

    const handleSaveProfile = async () => {
        try {
            const { error } = await supabase
                .from('portfolios')
                .update({
                    display_name: portfolio.display_name,
                    tagline: portfolio.tagline,
                    bio: portfolio.bio,
                    hero_title: portfolio.hero_title,
                    hero_subtitle: portfolio.hero_subtitle,
                    cta_text: portfolio.cta_text,
                    cta_url: portfolio.cta_url,
                    github_url: portfolio.github_url,
                    linkedin_url: portfolio.linkedin_url,
                    twitter_url: portfolio.twitter_url,
                    email: portfolio.email,
                    primary_color: portfolio.primary_color,
                    secondary_color: portfolio.secondary_color,
                    accent_color: portfolio.accent_color,
                })
                .eq('id', portfolio.id);

            if (error) throw error;
            router.refresh();
        } catch (error: any) {
            console.error('Error saving:', error);
            toast.error('Failed to save');
        }
    };

    const handleSaveAvatar = async (avatarUrl: string) => {
        try {
            const { error } = await supabase
                .from('portfolios')
                .update({ avatar_url: avatarUrl })
                .eq('id', portfolio.id);

            if (error) throw error;

            toast.success('Avatar updated!');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving avatar:', error);
            toast.error('Failed to save avatar');
        }
    };

    const handlePublish = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('portfolios')
                .update({ is_published: !portfolio.is_published })
                .eq('id', portfolio.id);

            if (error) throw error;

            setPortfolio({ ...portfolio, is_published: !portfolio.is_published });
            toast.success(portfolio.is_published ? 'Portfolio unpublished' : 'Portfolio published!');
            router.refresh();
        } catch (error: any) {
            console.error('Error publishing:', error);
            toast.error('Failed to publish');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        try {
            const { error } = await supabase.from('skills').delete().eq('id', skillId);

            if (error) throw error;

            toast.success('Skill removed');
            router.refresh();
        } catch (error: any) {
            console.error('Error deleting skill:', error);
            toast.error('Failed to delete skill');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">{portfolio.display_name || 'Untitled Portfolio'}</h1>
                            <p className="text-sm text-gray-500">{portfolio.username}.codeportfolio.io</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Auto-saving
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/${portfolio.username}`, '_blank')}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>

                        <Button
                            onClick={handlePublish}
                            variant={portfolio.is_published ? 'outline' : 'default'}
                            size="sm"
                            disabled={saving}
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            {portfolio.is_published ? 'Published' : 'Publish'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Progress Indicator */}
                    <div className="mb-6 bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Setup Progress</h3>
                            <span className="text-sm text-gray-600">
                                {Object.values(completionStatus).filter(Boolean).length} of 4 complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${(Object.values(completionStatus).filter(Boolean).length / 4) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <TabsList className="grid w-full grid-cols-4 mb-8 h-auto">
                        <TabsTrigger value="profile" className="relative py-3">
                            <span className="flex items-center gap-2">
                                Profile
                                {completionStatus.profile && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="relative py-3">
                            <span className="flex items-center gap-2">
                                Projects
                                {projects.length > 0 && (
                                    <span className="text-xs text-gray-500">({projects.length})</span>
                                )}
                                {completionStatus.projects && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="relative py-3">
                            <span className="flex items-center gap-2">
                                Skills
                                {skills.length > 0 && (
                                    <span className="text-xs text-gray-500">({skills.length})</span>
                                )}
                                {completionStatus.skills && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="theme" className="relative py-3">
                            <span className="flex items-center gap-2">
                                Theme
                                {completionStatus.theme && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <CardTitle>Basic Information</CardTitle>
                                </div>
                                <CardDescription>This information will be displayed on your portfolio</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">
                                        Display Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="displayName"
                                        placeholder="John Doe"
                                        value={portfolio.display_name || ''}
                                        onChange={(e) => {
                                            setPortfolio({ ...portfolio, display_name: e.target.value });
                                            if (validationErrors.displayName) {
                                                setValidationErrors({ ...validationErrors, displayName: '' });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!portfolio.display_name?.trim()) {
                                                setValidationErrors({ ...validationErrors, displayName: 'Display name is required' });
                                            }
                                        }}
                                        className={validationErrors.displayName ? 'border-red-500 focus:border-red-500' : ''}
                                    />
                                    {validationErrors.displayName && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {validationErrors.displayName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tagline">
                                        Tagline <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tagline"
                                        placeholder="Full-Stack Developer"
                                        value={portfolio.tagline || ''}
                                        onChange={(e) => {
                                            setPortfolio({ ...portfolio, tagline: e.target.value });
                                            if (validationErrors.tagline) {
                                                setValidationErrors({ ...validationErrors, tagline: '' });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!portfolio.tagline?.trim()) {
                                                setValidationErrors({ ...validationErrors, tagline: 'Tagline is required to showcase your role' });
                                            }
                                        }}
                                        className={validationErrors.tagline ? 'border-red-500 focus:border-red-500' : ''}
                                    />
                                    {validationErrors.tagline && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {validationErrors.tagline}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="heroTitle">Hero Title</Label>
                                    <Input
                                        id="heroTitle"
                                        placeholder="It's Me John"
                                        value={portfolio.hero_title || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, hero_title: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500">Large heading on your homepage</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                                    <Textarea
                                        id="heroSubtitle"
                                        placeholder="A short introduction paragraph..."
                                        rows={3}
                                        value={portfolio.hero_subtitle || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, hero_subtitle: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500">Brief intro shown on homepage</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Write a detailed bio about yourself"
                                        rows={4}
                                        value={portfolio.bio || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500">Shown in About section</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                                <CardDescription>Upload a custom avatar for your portfolio</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-shrink-0">
                                        {portfolio.avatar_url ? (
                                            <img
                                                src={portfolio.avatar_url}
                                                alt="Avatar"
                                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200">
                                                {portfolio.display_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                if (file.size > 5 * 1024 * 1024) {
                                                    toast.error('Image must be less than 5MB');
                                                    return;
                                                }

                                                try {
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                                                    const filePath = `avatars/${fileName}`;

                                                    const { error } = await supabase.storage
                                                        .from('portfolio-images')
                                                        .upload(filePath, file);

                                                    if (error) throw error;

                                                    const { data: { publicUrl } } = supabase.storage
                                                        .from('portfolio-images')
                                                        .getPublicUrl(filePath);

                                                    setPortfolio({ ...portfolio, avatar_url: publicUrl });
                                                    await handleSaveAvatar(publicUrl);
                                                    toast.success('Avatar uploaded!');
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error('Upload failed');
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Square image, at least 400x400px, max 5MB
                                        </p>
                                        {portfolio.avatar_url && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setPortfolio({ ...portfolio, avatar_url: null });
                                                    handleSaveAvatar('');
                                                }}
                                                className="mt-2 text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Social Links</CardTitle>
                                <CardDescription>Add your contact and social media information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={portfolio.email || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ctaText">CTA Button Text</Label>
                                    <Input
                                        id="ctaText"
                                        placeholder="Contact Me"
                                        value={portfolio.cta_text || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, cta_text: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ctaUrl">CTA Button URL (optional)</Label>
                                    <Input
                                        id="ctaUrl"
                                        placeholder="mailto:your@email.com or https://..."
                                        value={portfolio.cta_url || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, cta_url: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500">Leave empty to use your email</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="github">GitHub URL</Label>
                                    <Input
                                        id="github"
                                        placeholder="https://github.com/username"
                                        value={portfolio.github_url || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, github_url: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                                    <Input
                                        id="linkedin"
                                        placeholder="https://linkedin.com/in/username"
                                        value={portfolio.linkedin_url || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, linkedin_url: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter URL</Label>
                                    <Input
                                        id="twitter"
                                        placeholder="https://twitter.com/username"
                                        value={portfolio.twitter_url || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, twitter_url: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center pt-6 border-t">
                            <div className="flex-1">
                                {!canMoveToProjects && (
                                    <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">Complete required fields to continue</p>
                                            <ul className="mt-1 space-y-1">
                                                {!portfolio.display_name?.trim() && <li>• Add your display name</li>}
                                                {!portfolio.tagline?.trim() && <li>• Add your tagline</li>}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {canMoveToProjects && (
                                    <p className="text-sm text-green-600 flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Profile complete
                                    </p>
                                )}
                            </div>
                            <Button 
                                onClick={() => {
                                    if (canMoveToProjects) {
                                        setActiveTab('projects');
                                    } else {
                                        validateProfile();
                                        toast.error('Please complete all required fields');
                                    }
                                }}
                                className="gap-2 ml-4"
                                variant={canMoveToProjects ? 'default' : 'outline'}
                            >
                                Next: Add Projects
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        <div>
                                            <CardTitle>Projects</CardTitle>
                                            <CardDescription>Showcase your best work</CardDescription>
                                        </div>
                                    </div>
                                    <Button onClick={() => setShowAddProject(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Project
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {projects.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <Briefcase className="w-16 h-16 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                                        <p className="text-gray-600 mb-4">Add your first project to showcase your work</p>
                                        <Button onClick={() => setShowAddProject(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Your First Project
                                        </Button>
                                    </div>
                                ) : (
                                    <SortableProjectsList
                                        projects={projects}
                                        onEdit={setEditingProject}
                                        onDelete={(id, title) => setDeletingProject({ id, title })}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center pt-6 border-t">
                            <Button variant="outline" onClick={() => setActiveTab('profile')} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div className="flex items-center gap-4">
                                {!canMoveToSkills && (
                                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Add at least 1 project to continue</span>
                                    </div>
                                )}
                                {canMoveToSkills && (
                                    <p className="text-sm text-green-600 flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        {projects.length} project{projects.length > 1 ? 's' : ''} added
                                    </p>
                                )}
                                <Button 
                                    onClick={() => {
                                        if (canMoveToSkills) {
                                            setActiveTab('skills');
                                        } else {
                                            toast.error('Add at least one project to continue');
                                        }
                                    }}
                                    className="gap-2"
                                    variant={canMoveToSkills ? 'default' : 'outline'}
                                >
                                    Next: Add Skills
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Skills Tab */}
                    <TabsContent value="skills" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        <div>
                                            <CardTitle>Skills</CardTitle>
                                            <CardDescription>List your technical skills and expertise</CardDescription>
                                        </div>
                                    </div>
                                    <Button onClick={() => setShowAddSkill(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Skill
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {skills.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <Award className="w-16 h-16 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills yet</h3>
                                        <p className="text-gray-600 mb-4">Add your skills to showcase your expertise</p>
                                        <Button onClick={() => setShowAddSkill(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Your First Skill
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="group px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium flex items-center gap-2 hover:bg-blue-100 transition-colors"
                                            >
                                                {skill.name}
                                                <button
                                                    onClick={() => handleDeleteSkill(skill.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3 text-red-500 hover:text-red-700" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center pt-6 border-t">
                            <Button variant="outline" onClick={() => setActiveTab('projects')} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div className="flex items-center gap-4">
                                {!canMoveToTheme && (
                                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Add {3 - skills.length} more skill{skills.length === 2 ? '' : 's'} to continue</span>
                                    </div>
                                )}
                                {canMoveToTheme && (
                                    <p className="text-sm text-green-600 flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        {skills.length} skills added
                                    </p>
                                )}
                                <Button 
                                    onClick={() => {
                                        if (canMoveToTheme) {
                                            setActiveTab('theme');
                                        } else {
                                            toast.error(`Add ${3 - skills.length} more skill${skills.length === 2 ? '' : 's'}`);
                                        }
                                    }}
                                    className="gap-2"
                                    variant={canMoveToTheme ? 'default' : 'outline'}
                                >
                                    Next: Customize Theme
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Theme Tab */}
                    <TabsContent value="theme" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Palette className="w-5 h-5" />
                                    <CardTitle>Color Theme</CardTitle>
                                </div>
                                <CardDescription>Customize your portfolio colors to match your brand</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ColorPicker
                                    color={portfolio.primary_color}
                                    onChange={(color) => setPortfolio({ ...portfolio, primary_color: color })}
                                    label="Primary Color"
                                />

                                <ColorPicker
                                    color={portfolio.secondary_color}
                                    onChange={(color) => setPortfolio({ ...portfolio, secondary_color: color })}
                                    label="Secondary Color"
                                />

                                <ColorPicker
                                    color={portfolio.accent_color}
                                    onChange={(color) => setPortfolio({ ...portfolio, accent_color: color })}
                                    label="Accent Color"
                                />

                                {/* Color Preview */}
                                <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                                    <p className="text-sm font-medium text-gray-700">Preview</p>
                                    <div className="flex gap-4">
                                        <div
                                            className="flex-1 h-20 rounded-lg"
                                            style={{ backgroundColor: portfolio.primary_color }}
                                        ></div>
                                        <div
                                            className="flex-1 h-20 rounded-lg"
                                            style={{ backgroundColor: portfolio.secondary_color }}
                                        ></div>
                                        <div
                                            className="flex-1 h-20 rounded-lg"
                                            style={{ backgroundColor: portfolio.accent_color }}
                                        ></div>
                                    </div>
                                    <div className="space-y-2">
                                        <button
                                            className="w-full py-3 rounded-lg text-white font-medium"
                                            style={{ backgroundColor: portfolio.primary_color }}
                                        >
                                            Primary Button</button>
                                        <button
                                            className="w-full py-3 rounded-lg text-white font-medium"
                                            style={{ backgroundColor: portfolio.secondary_color }}
                                        >
                                            Secondary Button
                                        </button>
                                    </div>
                                </div>

                                {/* Preset Colors */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Quick Presets</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() =>
                                                setPortfolio({
                                                    ...portfolio,
                                                    primary_color: '#4F46E5',
                                                    secondary_color: '#7C3AED',
                                                    accent_color: '#EC4899',
                                                })
                                            }
                                            className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300"
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-4 flex-1 rounded bg-indigo-600"></div>
                                                <div className="h-4 flex-1 rounded bg-purple-600"></div>
                                                <div className="h-4 flex-1 rounded bg-pink-600"></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Indigo/Purple</p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setPortfolio({
                                                    ...portfolio,
                                                    primary_color: '#059669',
                                                    secondary_color: '#10B981',
                                                    accent_color: '#34D399',
                                                })
                                            }
                                            className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300"
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-4 flex-1 rounded bg-emerald-700"></div>
                                                <div className="h-4 flex-1 rounded bg-emerald-500"></div>
                                                <div className="h-4 flex-1 rounded bg-emerald-400"></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Emerald</p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setPortfolio({
                                                    ...portfolio,
                                                    primary_color: '#DC2626',
                                                    secondary_color: '#EF4444',
                                                    accent_color: '#F87171',
                                                })
                                            }
                                            className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300"
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-4 flex-1 rounded bg-red-600"></div>
                                                <div className="h-4 flex-1 rounded bg-red-500"></div>
                                                <div className="h-4 flex-1 rounded bg-red-400"></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Red</p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setPortfolio({
                                                    ...portfolio,
                                                    primary_color: '#2563EB',
                                                    secondary_color: '#3B82F6',
                                                    accent_color: '#60A5FA',
                                                })
                                            }
                                            className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300"
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-4 flex-1 rounded bg-blue-600"></div>
                                                <div className="h-4 flex-1 rounded bg-blue-500"></div>
                                                <div className="h-4 flex-1 rounded bg-blue-400"></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Blue</p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setPortfolio({
                                                    ...portfolio,
                                                    primary_color: '#EA580C',
                                                    secondary_color: '#F97316',
                                                    accent_color: '#FB923C',
                                                })
                                            }
                                            className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300"
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-4 flex-1 rounded bg-orange-600"></div>
                                                <div className="h-4 flex-1 rounded bg-orange-500"></div>
                                                <div className="h-4 flex-1 rounded bg-orange-400"></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Orange</p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setPortfolio({
                                                    ...portfolio,
                                                    primary_color: '#0891B2',
                                                    secondary_color: '#06B6D4',
                                                    accent_color: '#22D3EE',
                                                })
                                            }
                                            className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300"
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="h-4 flex-1 rounded bg-cyan-600"></div>
                                                <div className="h-4 flex-1 rounded bg-cyan-500"></div>
                                                <div className="h-4 flex-1 rounded bg-cyan-400"></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Cyan</p>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center pt-6 border-t">
                            <Button variant="outline" onClick={() => setActiveTab('skills')} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div className="flex gap-3">
                                <span className="text-green-600 flex items-center gap-2 text-sm">
                                    <Check className="w-4 h-4" />
                                    All set! Ready to publish
                                </span>
                                <Button
                                    onClick={handlePublish}
                                    className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                    size="lg"
                                >
                                    <Globe className="w-4 h-4" />
                                    Publish Portfolio
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Modals */}
            <AddProjectModal
                open={showAddProject}
                onOpenChange={setShowAddProject}
                portfolioId={portfolio.id}
            />

            <AddSkillModal open={showAddSkill} onOpenChange={setShowAddSkill} portfolioId={portfolio.id} />

            {editingProject && (
                <EditProjectModal
                    open={!!editingProject}
                    onOpenChange={(open) => !open && setEditingProject(null)}
                    project={editingProject}
                />
            )}

            {deletingProject && (
                <DeleteProjectDialog
                    open={!!deletingProject}
                    onOpenChange={(open) => !open && setDeletingProject(null)}
                    projectId={deletingProject.id}
                    projectTitle={deletingProject.title}
                />
            )}
        </div>
    );
}