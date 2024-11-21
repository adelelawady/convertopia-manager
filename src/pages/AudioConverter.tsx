import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Music } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUploader from "@/components/FileUploader";
import { toast } from "sonner";

const supportedInputFormats = [
  { ext: ".mp3", label: "MP3" },
  { ext: ".wav", label: "WAV" },
  { ext: ".ogg", label: "OGG" },
  { ext: ".m4a", label: "M4A" },
  { ext: ".flac", label: "FLAC" },
];

const outputFormats = [
  { value: "mp3", label: "MP3" },
  { value: "wav", label: "WAV" },
  { value: "ogg", label: "OGG" },
  { value: "m4a", label: "M4A" },
  { value: "flac", label: "FLAC" },
];

const AudioConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState(outputFormats[0].value);

  const handleConvert = (files: File[]) => {
    // Implement actual conversion logic here
    toast.success(`Converting ${files.length} files to ${selectedFormat.toUpperCase()}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Audio Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your audio files to various formats
      </p>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {outputFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Audio Files
          </label>
          <FileUploader
            acceptedFileTypes={supportedInputFormats.map(f => f.ext)}
            onConvert={handleConvert}
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Supported Input Formats</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supportedInputFormats.map((format) => (
            <Card key={format.ext} className="p-6">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {format.label}
              </h3>
              <p className="text-gray-600">Convert {format.label} audio files</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioConverter;