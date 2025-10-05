'use client';

import { useState, useEffect } from 'react';
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

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string[] | null;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
}

interface EditProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;  // Add | null
  }

export function EditProjectModal({ open, onOpenChange, project }: EditProjectModalProps) {

  if (!project) return null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || '',
    image_urls: project.image_url || [],
    demo_url: project.demo_url || '',
    github_url: project.github_url || '',
    tech_stack: project.tech_stack || [],
  });
  const [techInput, setTechInput] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Update form when project changes
  useEffect(() => {
    setFormData({
      title: project.title,
      description: project.description || '',
      image_urls: project.image_url || [],
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      tech_stack: project.tech_stack || [],
    });
  }, [project]);

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
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description || null,
          image_url: formData.image_urls.length > 0 ? formData.image_urls : null,
          demo_url: formData.demo_url || null,
          github_url: formData.github_url || null,
          tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : null,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success('Project updated!');
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project details and images
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you built..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Project Images</Label>
            <MultiImageUpload
              onImagesChange={(urls) => setFormData({ ...formData, image_urls: urls })}
              currentImages={formData.image_urls}
              maxImages={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack</Label>
            <div className="flex gap-2">
              <Input
                id="techStack"
                placeholder="Add technology..."
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}