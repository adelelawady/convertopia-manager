import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, File, CheckCircle2 } from "lucide-react";

interface FileWithProgress extends File {
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface FileUploaderProps {
  acceptedFileTypes: string[];
  maxFiles?: number;
  onConvert: (files: File[]) => void;
}

const FileUploader = ({
  acceptedFileTypes,
  maxFiles = 10,
  onConvert,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        ...file,
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach((file) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.name === file.name
                  ? { ...f, progress: 100, status: "completed" as const }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.name === file.name ? { ...f, progress } : f
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
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxFiles,
  });

  const handleConvertAll = () => {
    const completedFiles = files.filter(
      (file) => file.status === "completed"
    );
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
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <File className="h-6 w-6 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    {file.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-accent ml-2 flex-shrink-0" />
                    )}
                  </div>
                  <Progress value={file.progress} className="mt-2" />
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