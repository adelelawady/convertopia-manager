import { useState } from 'react';
import { handleConversion } from '@/utils/conversionHandler';
import { FileUploader } from '@/components/FileUploader';
import { ArrowLeft } from 'lucide-react';
import { Link } from "react-router-dom";

const OggConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState('mp3');

  const handleConvert = async (files: File[]) => {
    return await handleConversion({
      files,
      outputFormat: selectedFormat,
      inputFormat: 'OGG'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/audio-converter" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Audio Formats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">OGG Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your OGG files to other popular audio formats
      </p>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <select 
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="p-2 border rounded w-[180px]"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="m4a">M4A</option>
            <option value="flac">FLAC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload OGG Files
          </label>
          <FileUploader
            acceptedFileTypes={[".ogg"]}
            maxFiles={10}
            onConvert={handleConvert}
            outputFormat={selectedFormat}
          />
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <h3 className="font-medium text-gray-700 mb-2">About OGG Conversion</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>OGG to MP3: Convert to widely supported format</li>
            <li>OGG to WAV: Uncompressed audio for editing</li>
            <li>OGG to M4A: Modern AAC-based format</li>
            <li>OGG to FLAC: Lossless compression</li>
          </ul>
          <p className="mt-2 text-yellow-600">
            Note: OGG is already a compressed format, converting to another compressed format may affect quality
          </p>
        </div>
      </div>
    </div>
  );
};

export default OggConverter; 