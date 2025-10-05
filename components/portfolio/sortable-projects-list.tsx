'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string[] | null;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
  display_order: number;
}

interface SortableProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string, title: string) => void;
}

function SortableProjectItem({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string, title: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Project Image */}
        {project.image_url && project.image_url.length > 0 && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={project.image_url[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg mb-1">{project.title}</h4>
          {project.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {project.description}
            </p>
          )}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {project.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(project.id, project.title)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SortableProjectsList({
  projects: initialProjects,
  onEdit,
  onDelete,
}: SortableProjectsListProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    const newProjects = arrayMove(projects, oldIndex, newIndex);
    setProjects(newProjects);

    // Update display_order in database
    setSaving(true);
    try {
      const updates = newProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('projects')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast.success('Project order updated');
      router.refresh();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      // Revert on error
      setProjects(initialProjects);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {saving && (
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
          Saving new order...
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableProjectItem
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}