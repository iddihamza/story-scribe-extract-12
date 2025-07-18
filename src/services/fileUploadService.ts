import { supabase } from "@/integrations/supabase/client";

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  fileUrl?: string;
  error?: string;
}

export interface FileProcessResult {
  success: boolean;
  extractedContent?: {
    plain: string;
    xml: string;
  };
  error?: string;
}

class FileUploadService {
  async uploadFile(file: File, userId: string): Promise<FileUploadResult> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return {
        success: true,
        filePath: data.path,
        fileUrl: publicUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async processFile(filePath: string): Promise<FileProcessResult> {
    try {
      // Download the file from storage
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);

      if (error) {
        return { success: false, error: error.message };
      }

      // For now, we'll simulate content extraction
      // In a real implementation, you would parse different file types
      const fileContent = await this.extractContent(data, filePath);
      
      return {
        success: true,
        extractedContent: fileContent
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed'
      };
    }
  }

  private async extractContent(file: Blob, filePath: string): Promise<{ plain: string; xml: string }> {
    const fileExt = filePath.split('.').pop()?.toLowerCase();
    
    // For demonstration, we'll handle text files and simulate other formats
    if (fileExt === 'txt') {
      const text = await file.text();
      return {
        plain: text,
        xml: this.convertToXML(text)
      };
    }
    
    // For other file types (docx, pdf, etc.), simulate extraction
    // In a real implementation, you'd use libraries like mammoth.js for docx, pdf-parse for pdf, etc.
    const simulatedContent = `Extracted content from ${filePath}\n\nThis is simulated content that would be extracted from the uploaded file. In a real implementation, this would parse the actual file content using appropriate libraries for each file type.`;
    
    return {
      plain: simulatedContent,
      xml: this.convertToXML(simulatedContent)
    };
  }

  private convertToXML(plainText: string): string {
    // Simple conversion to XML format
    const lines = plainText.split('\n');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<document>\n';
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        xml += `  <paragraph id="${index + 1}">${this.escapeXML(line.trim())}</paragraph>\n`;
      }
    });
    
    xml += '</document>';
    return xml;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  async deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }
}

export const fileUploadService = new FileUploadService();