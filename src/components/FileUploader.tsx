import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface FileWithStatus {
  id: string;
  file: File;
  status: 'idle' | 'converting' | 'completed' | 'error';
  convertedFile?: {
    file: File;
    url: string;
    originalName: string;
    outputFormat: string;
  };
}

interface FileUploaderProps {
  acceptedFileTypes: string[];
  maxFiles?: number;
  onConvert: (files: File[]) => Promise<any>;
  outputFormat: string;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const FileUploader = ({
  acceptedFileTypes,
  maxFiles = 10,
  onConvert,
  outputFormat,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);

  // Convert file extensions to MIME types
  const acceptedMimeTypes = {
    '.png': { 'image/png': [] },
    '.jpeg': { 'image/jpeg': [] },
    '.webp': { 'image/webp': [] },
    '.gif': { 'image/gif': [] },
  };

  const accept = acceptedFileTypes.reduce((acc, type) => ({
    ...acc,
    ...(acceptedMimeTypes[type.toLowerCase()] || {})
  }), {});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'idle' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  const handleConvert = async (fileId: string) => {
    // Find the file to convert
    const fileToConvert = files.find(f => f.id === fileId);
    if (!fileToConvert) return;

    // Update status to converting
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'converting' } : f
    ));

    try {
      const result = await onConvert([fileToConvert.file]);

      if (result.success && result.convertedFiles?.length > 0) {
        // Update file status with converted file
        setFiles(prev => prev.map(f => 
          f.id === fileId ? {
            ...f,
            status: 'completed',
            convertedFile: result.convertedFiles[0]
          } : f
        ));
      } else {
        throw new Error('Conversion failed');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error' } : f
      ));
      toast.error(`Failed to convert file: ${fileToConvert.file.name}`);
    }
  };

  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file?.convertedFile) {
      const a = document.createElement('a');
      a.href = file.convertedFile.url;
      a.download = file.convertedFile.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.convertedFile) {
        URL.revokeObjectURL(fileToRemove.convertedFile.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Accepted formats: {acceptedFileTypes.join(', ')}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg"
            >
              <div className="flex flex-col flex-grow mr-4">
                <span className="font-medium truncate max-w-xs">
                  {file.file.name}
                </span>
                <div className="text-sm text-gray-500 flex gap-2">
                  <span>{formatFileSize(file.file.size)}</span>
                  <span>→</span>
                  <span className="uppercase">
                    {file.status === 'completed' && file.convertedFile 
                      ? file.convertedFile.outputFormat 
                      : outputFormat}
                  </span>
                  {file.convertedFile && (
                    <span>
                      ({formatFileSize(file.convertedFile.file.size)})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {file.status === 'idle' && (
                  <Button onClick={() => handleConvert(file.id)} size="sm">
                    Convert
                  </Button>
                )}
                
                {file.status === 'converting' && (
                  <Button disabled size="sm" className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Converting...
                  </Button>
                )}
                
                {file.status === 'completed' && (
                  <>
                    <Button
                      onClick={() => handleDownload(file.id)}
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                    >
                      Download
                    </Button>
                  </>
                )}
                
                {file.status === 'error' && (
                  <Button
                    onClick={() => handleConvert(file.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Retry
                  </Button>
                )}
                
                <Button
                  onClick={() => removeFile(file.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;