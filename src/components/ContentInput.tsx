import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploadZone } from './FileUploadZone';

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  selectedTemplates: string[];
  setSelectedTemplates: (templates: string[]) => void;
  onExtract: () => void;
  onReset: () => void;
  isExtracting: boolean;
  onFileUploadSuccess?: () => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  content,
  setContent,
  selectedTemplates,
  setSelectedTemplates,
  onExtract,
  onReset,
  isExtracting,
  onFileUploadSuccess,
}) => {
  const templates = [
    { id: 'character', label: '👤 Character', color: 'character-color' },
    { id: 'location', label: '📍 Location', color: 'location-color' },
    { id: 'story', label: '📚 Overall Story', color: 'event-color' },
    { id: 'chapter', label: '📖 Chapter', color: 'item-color' },
  ];

  const toggleTemplate = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      setSelectedTemplates(selectedTemplates.filter(t => t !== templateId));
    } else {
      setSelectedTemplates([...selectedTemplates, templateId]);
    }
  };

  return (
    <div className="bg-gradient-panel backdrop-blur-panel rounded-2xl p-6 shadow-panel">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">📝</span>
        <h2 className="text-xl font-semibold text-primary-dark">Content Input</h2>
      </div>
      
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Input</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your story content here..."
            className="min-h-[200px] font-mono text-sm resize-y"
          />

          <div>
            <div className="font-semibold text-primary-dark mb-3">
              Select extraction templates:
            </div>
            <div className="flex flex-wrap gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => toggleTemplate(template.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border-2 ${
                    selectedTemplates.includes(template.id)
                      ? 'bg-primary-blue border-secondary-blue text-white'
                      : 'bg-muted-bg border-gray-300 text-gray-700 hover:border-primary-blue'
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={onExtract}
              disabled={isExtracting}
              className="bg-primary-blue hover:bg-secondary-blue transition-all duration-300 transform hover:-translate-y-1"
            >
              {isExtracting ? '🔄 Extracting...' : '🔍 Extract Structured Data'}
            </Button>
            <Button 
              variant="secondary"
              onClick={onReset}
              className="bg-gray-400 hover:bg-gray-500 transition-all duration-300"
            >
              🔄 Reset
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="file" className="space-y-4">
          <FileUploadZone onUploadSuccess={onFileUploadSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};