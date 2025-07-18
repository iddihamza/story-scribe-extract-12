import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { databaseService, FileUploadData } from '@/services/databaseService';

interface FileUploadZoneProps {
  onUploadSuccess?: () => void;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onUploadSuccess,
  onUploadStart,
  onUploadComplete
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    onUploadStart?.();

    try {
      const uploadData: FileUploadData = {
        file: selectedFile,
        chapterTitle: chapterTitle || undefined
      };

      const result = await databaseService.uploadAndProcessFile(uploadData);

      if (result.success) {
        toast({
          title: "Upload successful",
          description: result.message
        });
        setSelectedFile(null);
        setChapterTitle('');
        onUploadSuccess?.();
      } else {
        toast({
          title: "Upload failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upload error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      onUploadComplete?.();
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setChapterTitle('');
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['.txt', '.docx', '.pdf', '.doc'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    return validTypes.includes(fileExt);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Upload Document</h3>
          <p className="text-sm text-muted-foreground">
            Upload a document file to extract and save its content
          </p>
        </div>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports: .txt, .docx, .doc, .pdf
            </p>
            <input
              type="file"
              accept=".txt,.docx,.doc,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Select File
              </label>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <File className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {!isValidFileType(selectedFile) && (
                  <p className="text-sm text-destructive">
                    Warning: File type may not be supported
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter-title">Chapter Title (Optional)</Label>
              <Input
                id="chapter-title"
                placeholder="Enter a title for the chapter..."
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Processing...' : 'Upload and Process'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};