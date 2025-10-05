'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);

  const handleChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-20 h-10 p-0 border-2"
              style={{ backgroundColor: localColor }}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <HexColorPicker color={localColor} onChange={handleChange} />
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={localColor}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1"
          placeholder="#4F46E5"
          maxLength={7}
        />
      </div>
    </div>
  );
}