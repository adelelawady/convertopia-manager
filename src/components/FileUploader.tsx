import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, File, CheckCircle2, X } from "lucide-react";

interface FileWithProgress {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  id: string;
}

interface FileUploaderProps {
  acceptedFileTypes: string[];
  maxFiles?: number;
  onConvert: (files: File[]) => void;
}

// MIME type mapping
const MIME_TYPES: { [key: string]: string[] } = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.txt': ['text/plain'],
  '.rtf': ['application/rtf'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.webp': ['image/webp'],
  '.gif': ['image/gif'],
  '.mp3': ['audio/mpeg'],
  '.wav': ['audio/wav'],
  '.ogg': ['audio/ogg'],
  '.m4a': ['audio/mp4'],
  '.flac': ['audio/flac'],
};

const FileUploader = ({
  acceptedFileTypes,
  maxFiles = 10,
  onConvert,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);

  // Convert file extensions to MIME types
  const acceptedMimeTypes = acceptedFileTypes.reduce((acc, type) => {
    const mimeTypes = MIME_TYPES[type.toLowerCase()] || [];
    mimeTypes.forEach(mimeType => {
      acc[mimeType] = [];
    });
    return acc;
  }, {} as { [key: string]: string[] });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
        id: Math.random().toString(36).substring(7),
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach((fileWithProgress) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileWithProgress.id
                  ? { ...f, progress: 100, status: "completed" as const }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileWithProgress.id ? { ...f, progress } : f
              )
            );
          }
        }, 300);
      });
    },
    [files.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes,
    maxFiles,
    multiple: true,
  });

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleConvertAll = () => {
    const completedFiles = files.filter(
      (file) => file.status === "completed"
    ).map(f => f.file);
    if (completedFiles.length === 0) {
      toast.error("No files ready for conversion");
      return;
    }
    onConvert(completedFiles);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: {acceptedFileTypes.join(", ")}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((fileWithProgress) => (
            <div
              key={fileWithProgress.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <File className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate" title={fileWithProgress.file.name}>
                        {fileWithProgress.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileWithProgress.file.size)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {fileWithProgress.status === "completed" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(fileWithProgress.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <Progress value={fileWithProgress.progress} className="mt-2" />
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={handleConvertAll}
            className="w-full"
            disabled={!files.some((f) => f.status === "completed")}
          >
            Convert All Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;