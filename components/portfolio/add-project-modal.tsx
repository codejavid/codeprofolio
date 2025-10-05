'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiImageUpload } from './multi-image-upload';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';

interface AddProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    portfolioId: string;
}

export function AddProjectModal({ open, onOpenChange, portfolioId }: AddProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_urls: [] as string[], // Changed from image_url
        demo_url: '',
        github_url: '',
        tech_stack: [] as string[],
    });
    const [techInput, setTechInput] = useState('');
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleAddTech = () => {
        if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
            setFormData({
                ...formData,
                tech_stack: [...formData.tech_stack, techInput.trim()],
            });
            setTechInput('');
        }
    };

    const handleRemoveTech = (tech: string) => {
        setFormData({
            ...formData,
            tech_stack: formData.tech_stack.filter(t => t !== tech),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Please enter a project title');
            return;
        }

        setLoading(true);

        try {
            // Get current max display_order
            const { data: existingProjects } = await supabase
                .from('projects')
                .select('display_order')
                .eq('portfolio_id', portfolioId)
                .order('display_order', { ascending: false })
                .limit(1);

            const maxOrder = existingProjects?.[0]?.display_order || 0;

            // Create project
            const { error } = await supabase.from('projects').insert({
                portfolio_id: portfolioId,
                title: formData.title,
                description: formData.description || null,
                image_url: formData.image_urls.length > 0 ? formData.image_urls : null, // Changed
                demo_url: formData.demo_url || null,
                github_url: formData.github_url || null,
                tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : null,
                display_order: maxOrder + 1,
            });

            if (error) throw error;

            toast.success('Project added! 🎉');

            // Reset form
            setFormData({
                title: '',
                description: '',
                image_urls: [], // Changed
                demo_url: '',
                github_url: '',
                tech_stack: [],
              });

            onOpenChange(false);
            router.refresh();
        } catch (error: any) {
            console.error('Error adding project:', error);
            toast.error('Failed to add project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>
                        Showcase your work by adding project details and images
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                            id="title"
                            placeholder="My Awesome Project"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what you built and the problem it solves..."
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Project Images (up to 5)</Label>
                        <MultiImageUpload
                            onImagesChange={(urls) => setFormData({ ...formData, image_urls: urls })}
                            currentImages={formData.image_urls}
                            maxImages={5}
                        />
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <Label htmlFor="techStack">Tech Stack</Label>
                        <div className="flex gap-2">
                            <Input
                                id="techStack"
                                placeholder="React, Node.js, MongoDB..."
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTech();
                                    }
                                }}
                                disabled={loading}
                            />
                            <Button
                                type="button"
                                onClick={handleAddTech}
                                variant="outline"
                                disabled={loading || !techInput.trim()}
                            >
                                Add
                            </Button>
                        </div>

                        {formData.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tech_stack.map((tech) => (
                                    <div
                                        key={tech}
                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTech(tech)}
                                            className="hover:text-blue-900"
                                            disabled={loading}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Demo URL */}
                    <div className="space-y-2">
                        <Label htmlFor="demoUrl">Demo URL</Label>
                        <Input
                            id="demoUrl"
                            type="url"
                            placeholder="https://myproject.com"
                            value={formData.demo_url}
                            onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* GitHub URL */}
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input
                            id="githubUrl"
                            type="url"
                            placeholder="https://github.com/username/repo"
                            value={formData.github_url}
                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Project'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}