import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize } from '@/utils/formatFileSize';

interface FileUploaderProps {
  acceptedFileTypes: string[];
  maxFiles?: number;
  onConvert: (files: File[]) => Promise<any>;
  outputFormat: string;
}

interface UploadedFile {
  id: string;
  file: File;
  status: 'idle' | 'converting' | 'completed' | 'error';
  result?: any;
  originalSize?: number;
  convertedSize?: number;
  outputFormat: string;
}

// Define supported conversion formats for each input type
const supportedConversions: { [key: string]: string[] } = {
  // Audio formats
  'mp3': ['wav', 'ogg', 'm4a', 'flac'],
  'wav': ['mp3', 'ogg', 'm4a', 'flac'],
  'ogg': ['mp3', 'wav', 'm4a', 'flac'],
  'm4a': ['mp3', 'wav', 'ogg', 'flac'],
  'flac': ['mp3', 'wav', 'ogg', 'm4a'],
  // Image formats
  'png': ['jpeg', 'webp', 'gif', 'ico', 'bmp'],
  'jpeg': ['png', 'webp', 'gif', 'ico', 'bmp'],
  'webp': ['png', 'jpeg', 'gif', 'ico', 'bmp'],
  'gif': ['png', 'jpeg', 'webp', 'ico', 'bmp'],
  'ico': ['png', 'jpeg', 'webp', 'gif', 'bmp'],
  'bmp': ['png', 'jpeg', 'webp', 'gif', 'ico'],
  // Document formats
  'pdf': ['doc', 'docx', 'txt', 'rtf'],
  'doc': ['pdf', 'docx', 'txt', 'rtf'],
  'docx': ['pdf', 'doc', 'txt', 'rtf'],
  'txt': ['pdf', 'doc', 'docx', 'rtf'],
  'rtf': ['pdf', 'doc', 'docx', 'txt']
};

// Define MIME types for all supported formats
const mimeTypes: { [key: string]: string[] } = {
  // Audio formats
  'mp3': ['audio/mpeg'],
  'wav': ['audio/wav', 'audio/wave', 'audio/x-wav'],
  'ogg': ['audio/ogg', 'application/ogg'],
  'm4a': ['audio/mp4', 'audio/x-m4a'],
  'flac': ['audio/flac', 'audio/x-flac'],
  // Image formats
  'png': ['image/png'],
  'jpg': ['image/jpeg'],
  'jpeg': ['image/jpeg'],
  'webp': ['image/webp'],
  'gif': ['image/gif'],
  'ico': ['image/x-icon', 'image/vnd.microsoft.icon'],
  'bmp': ['image/bmp', 'image/x-bmp'],
  // Document formats
  'pdf': ['application/pdf'],
  'doc': ['application/msword'],
  'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'txt': ['text/plain'],
  'rtf': ['application/rtf', 'text/rtf']
};

export const FileUploader = ({
  acceptedFileTypes,
  maxFiles = 10,
  onConvert,
  outputFormat,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [browserSupported, setBrowserSupported] = useState(true);

  useEffect(() => {
    // Check if SharedArrayBuffer is supported
    if (typeof SharedArrayBuffer === 'undefined') {
      setBrowserSupported(false);
      toast.error('Your browser does not support some required features. Please use a modern browser.');
    }
  }, []);

  // Create accept object for dropzone based on input format
  const acceptObject = acceptedFileTypes.reduce((acc, type) => {
    // Remove the dot and get the format
    const format = type.toLowerCase().replace('.', '');
    const mimeTypeList = mimeTypes[format] || [];
    
    return {
      ...acc,
      ...mimeTypeList.reduce((mimeAcc, mime) => ({
        ...mimeAcc,
        [mime]: []
      }), {})
    };
  }, {});

  // Validate if the output format is supported for the input format
  const validateConversion = (file: File) => {
    const inputFormat = file.name.split('.').pop()?.toLowerCase() || '';
    return supportedConversions[inputFormat]?.includes(outputFormat.toLowerCase());
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => validateConversion(file));
    const invalidFiles = acceptedFiles.filter(file => !validateConversion(file));

    if (invalidFiles.length > 0) {
      toast.error(`Unsupported conversion for some files: ${invalidFiles.map(f => f.name).join(', ')}`);
    }

    const newFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'idle' as const,
      originalSize: file.size,
      outputFormat: outputFormat.toLowerCase()
    }));

    setFiles(prev => {
      const combined = [...prev, ...newFiles];
      if (combined.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return prev;
      }
      return combined;
    });
  }, [maxFiles, outputFormat]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObject,
    maxFiles,
  });

  const handleConvert = async (fileId: string) => {
    const fileToConvert = files.find(f => f.id === fileId);
    if (!fileToConvert) return;

    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, status: 'converting' } : f
      )
    );

    try {
      const result = await onConvert([fileToConvert.file]);
      const convertedSize = result.convertedFiles[0]?.file.size;
      
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { 
            ...f, 
            status: 'completed', 
            result,
            convertedSize 
          } : f
        )
      );
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const handleConvertAll = async () => {
    const idleFiles = files.filter(f => f.status === 'idle');
    if (idleFiles.length === 0) return;

    try {
      setFiles(prev =>
        prev.map(f =>
          f.status === 'idle' ? { ...f, status: 'converting' } : f
        )
      );

      const result = await onConvert(idleFiles.map(f => f.file));

      setFiles(prev =>
        prev.map(f =>
          f.status === 'converting' ? { ...f, status: 'completed', result } : f
        )
      );
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.status === 'converting' ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDownload = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file?.result?.convertedFiles?.[0]) return;

    const { url, file: convertedFile } = file.result.convertedFiles[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!browserSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Your browser does not support some required features for audio conversion. 
          Please use a modern browser like Chrome, Edge, or Firefox with cross-origin isolation enabled.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : `Drag & drop ${acceptedFileTypes.join(', ')} files here, or click to select files`}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported output formats: {supportedConversions[acceptedFileTypes[0].replace('.', '')]?.join(', ')}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Files to Convert</h3>
            {files.some(f => f.status === 'idle') && (
              <Button onClick={handleConvertAll}>
                Convert All to {outputFormat.toUpperCase()}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[200px] font-medium">
                      {file.file.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      → .{file.outputFormat}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Original: {formatFileSize(file.originalSize)}</span>
                    {file.convertedSize && (
                      <>
                        <span className="mx-2">→</span>
                        <span className={`font-medium ${
                          file.convertedSize < file.originalSize 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {formatFileSize(file.convertedSize)}
                          {file.convertedSize < file.originalSize && (
                            <span className="ml-1 text-green-600">
                              ({Math.round((1 - file.convertedSize / file.originalSize) * 100)}% smaller)
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.status === 'idle' && (
                    <Button
                      onClick={() => handleConvert(file.id)}
                      variant="outline"
                      size="sm"
                    >
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
        </div>
      )}
    </div>
  );
};

export default FileUploader;