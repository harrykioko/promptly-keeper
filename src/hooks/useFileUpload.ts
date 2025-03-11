import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

export interface FileUploadOptions {
  bucket: string;
  filePath?: string;
  fileTypes?: string[];
  maxSizeMB?: number;
  onSuccess?: (url: string, filePath: string) => void;
  onError?: (error: Error) => void;
}

export interface FileUploadResult {
  uploading: boolean;
  url: string | null;
  error: Error | null;
  upload: (file: File) => Promise<string | null>;
  reset: () => void;
}

/**
 * Custom hook for handling file uploads to Supabase storage
 * @param options Upload options
 * @returns File upload state and functions
 */
export const useFileUpload = (options: FileUploadOptions): FileUploadResult => {
  const {
    bucket,
    filePath,
    fileTypes,
    maxSizeMB = 5,
    onSuccess,
    onError
  } = options;
  
  const [uploading, setUploading] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const reset = () => {
    setUploading(false);
    setUrl(null);
    setError(null);
  };
  
  const upload = async (file: File): Promise<string | null> => {
    try {
      // Reset state
      reset();
      setUploading(true);
      
      // Validate file type if fileTypes is provided
      if (fileTypes && fileTypes.length > 0) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        if (!fileTypes.includes(fileExt) && !fileTypes.includes('*')) {
          const error = new Error(`File type not allowed. Allowed types: ${fileTypes.join(', ')}`);
          setError(error);
          onError?.(error);
          toast({
            title: "File type not allowed",
            description: `Allowed types: ${fileTypes.join(', ')}`,
            variant: "destructive",
          });
          return null;
        }
      }
      
      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const error = new Error(`File size must be less than ${maxSizeMB}MB`);
        setError(error);
        onError?.(error);
        toast({
          title: "File too large",
          description: `Maximum size: ${maxSizeMB}MB`,
          variant: "destructive",
        });
        return null;
      }
      
      // Generate file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const path = filePath ? `${filePath}/${fileName}` : fileName;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
        
      const publicUrl = data.publicUrl;
      
      // Update state
      setUrl(publicUrl);
      setUploading(false);
      
      // Call success callback
      onSuccess?.(publicUrl, path);
      
      return publicUrl;
      
    } catch (err: any) {
      const error = new Error(err.message || 'Error uploading file');
      setError(error);
      setUploading(false);
      
      // Call error callback
      onError?.(error);
      
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      
      return null;
    }
  };
  
  return {
    uploading,
    url,
    error,
    upload,
    reset
  };
};
