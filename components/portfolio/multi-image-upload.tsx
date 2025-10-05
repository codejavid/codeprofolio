'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { X, Loader2, ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface MultiImageUploadProps {
    onImagesChange: (urls: string[]) => void;
    currentImages?: string[];
    maxImages?: number;
}

export function MultiImageUpload({
    onImagesChange,
    currentImages = [],
    maxImages = 5
}: MultiImageUploadProps) {
    const [images, setImages] = useState<string[]>(currentImages);
    const [uploading, setUploading] = useState(false);
    const supabase = createClientComponentClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (images.length + files.length > maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                // Validate
                if (!file.type.startsWith('image/')) {
                    throw new Error(`${file.name} is not an image`);
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`${file.name} is too large (max 5MB)`);
                }

                // Upload
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `project-images/${fileName}`;

                const { error } = await supabase.storage
                    .from('portfolio-images')
                    .upload(filePath, file);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio-images')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const urls = await Promise.all(uploadPromises);
            const newImages = [...images, ...urls];
            setImages(newImages);
            onImagesChange(newImages);
            toast.success(`${urls.length} image(s) uploaded!`);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async (urlToRemove: string) => {
        try {
            // Extract file path and delete from storage
            const url = new URL(urlToRemove);
            const pathParts = url.pathname.split('/');
            const filePath = pathParts.slice(-2).join('/');

            await supabase.storage
                .from('portfolio-images')
                .remove([filePath]);

            const newImages = images.filter(img => img !== urlToRemove);
            setImages(newImages);
            onImagesChange(newImages);
            toast.success('Image removed');
        } catch (error) {
            console.error('Remove error:', error);
        }
    };

    return (
        <div className="space-y-4">
            {/* Uploaded Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {images.map((img, index) => (
                        <div key={img} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                                src={`${img}#${Date.now()}`}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                {index === 0 && (
                                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                                        Main
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemove(img)}
                                    disabled={uploading}
                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {images.length < maxImages && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 mb-2 text-blue-500 animate-spin" />
                                <p className="text-sm text-gray-600">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Upload images</span> ({images.length}/{maxImages})
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP (Max 5MB each)</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
}