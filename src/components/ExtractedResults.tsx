import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExtractedItem } from './StoryExtractionTool';
import { databaseService } from '@/services/databaseService';
import { useToast } from '@/hooks/use-toast';

interface ExtractedResultsProps {
  extractedData: ExtractedItem[];
  onApproveAll: () => void;
  onExportData: () => void;
}

export const ExtractedResults: React.FC<ExtractedResultsProps> = ({
  extractedData,
  onApproveAll,
  onExportData,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const getTypeIcon = (type: string) => {
    const icons = {
      'character': '👤',
      'location': '📍',
      'story': '📚',
      'chapter': '📖'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'character': 'border-l-character-color',
      'location': 'border-l-location-color',
      'story': 'border-l-event-color',
      'chapter': 'border-l-item-color'
    };
    return colors[type as keyof typeof colors] || 'border-l-primary-blue';
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      'character': 'bg-character-color',
      'location': 'bg-location-color',
      'story': 'bg-event-color',
      'chapter': 'bg-item-color'
    };
    return colors[type as keyof typeof colors] || 'bg-primary-blue';
  };

  const handleEditField = (fieldName: string) => {
    alert(`Edit functionality for "${fieldName}" would open an inline editor here`);
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    
    try {
      // Check if user is authenticated
      const isAuthenticated = await databaseService.checkAuthStatus();
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save data to the database.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      const result = await databaseService.saveExtractedData(extractedData);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          variant: "default"
        });
        onApproveAll(); // Call the original approve function for any additional handling
      } else {
        toast({
          title: "Save Failed",
          description: result.message,
          variant: "destructive"
        });
        
        if (result.errors) {
          console.error('Save errors:', result.errors);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving.",
        variant: "destructive"
      });
      console.error('Save error:', error);
    }
    
    setIsSaving(false);
  };

  return (
    <div className="bg-gradient-panel backdrop-blur-panel rounded-2xl p-6 shadow-panel">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">📋</span>
        <h2 className="text-xl font-semibold text-primary-dark">Extracted Data Review</h2>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5 max-h-[500px] overflow-y-auto mb-5">
        {extractedData.length === 0 ? (
          <div className="text-center text-gray-500 italic py-10">
            Extract content to see structured data here...
          </div>
        ) : (
          extractedData.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-5 mb-4 border-l-4 ${getTypeColor(item.type)} relative`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className={`${getTypeBadgeColor(item.type)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                    {getTypeIcon(item.type)} {item.type}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    item.confidence === 'inferred' 
                      ? 'bg-danger-color text-white' 
                      : 'bg-success-color text-white'
                  }`}>
                    {item.confidence}
                  </span>
                </div>
              </div>
              
              {Object.entries(item.data).map(([key, value]) => (
                <div key={key} className="flex items-center mb-3">
                  <div className="font-semibold text-primary-dark w-24 flex-shrink-0">
                    {key}:
                  </div>
                  <div className={`flex-grow mr-3 px-3 py-2 rounded-md font-mono text-sm ${
                    item.inferred_fields?.includes(key) 
                      ? 'bg-red-50 border border-dashed border-red-300' 
                      : item.missing_fields?.includes(key)
                      ? 'bg-yellow-50 border border-dashed border-yellow-300 italic text-yellow-600'
                      : 'bg-muted-bg'
                  }`}>
                    {value === null ? 'Not found' : 
                     Array.isArray(value) ? value.join(', ') : 
                     String(value)}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditField(key)}
                    className="text-xs"
                  >
                    Edit
                  </Button>
                </div>
              ))}
              
              {item.inferred_fields && item.inferred_fields.length > 0 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-sm">
                  <strong className="text-red-700">⚠️ Inferred fields:</strong>{' '}
                  <span className="text-red-600">{item.inferred_fields.join(', ')}</span>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-primary-blue text-sm text-gray-600">
                <strong>Source:</strong> "{item.source}"
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={handleSaveToDatabase}
          disabled={extractedData.length === 0 || isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
        >
          {isSaving ? '💾 Saving...' : '💾 Save to Database'}
        </Button>
        <Button 
          onClick={onApproveAll}
          disabled={extractedData.length === 0}
          className="bg-success-color hover:bg-green-600 transition-all duration-300"
        >
          ✅ Approve All
        </Button>
        <Button 
          variant="secondary"
          onClick={onExportData}
          disabled={extractedData.length === 0}
          className="bg-gray-400 hover:bg-gray-500 transition-all duration-300"
        >
          📤 Export JSON
        </Button>
      </div>
    </div>
  );
};