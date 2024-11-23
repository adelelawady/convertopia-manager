import { useState } from 'react';
import { handleConversion } from '@/utils/conversionHandler';
import { FileUploader } from '@/components/FileUploader';
import { ArrowLeft } from 'lucide-react';
import { Link } from "react-router-dom";

const M4aConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState('mp3');

  const handleConvert = async (files: File[]) => {
    return await handleConversion({
      files,
      outputFormat: selectedFormat,
      inputFormat: 'M4A'
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
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">M4A Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your M4A files to other popular audio formats
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
            <option value="ogg">OGG</option>
            <option value="flac">FLAC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload M4A Files
          </label>
          <FileUploader
            acceptedFileTypes={[".m4a"]}
            maxFiles={10}
            onConvert={handleConvert}
            outputFormat={selectedFormat}
          />
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <h3 className="font-medium text-gray-700 mb-2">About M4A Conversion</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>M4A to MP3: Universal compatibility across devices</li>
            <li>M4A to WAV: Uncompressed format for editing</li>
            <li>M4A to OGG: Open-source alternative format</li>
            <li>M4A to FLAC: Lossless audio quality</li>
          </ul>
          <p className="mt-2 text-yellow-600">
            Note: M4A uses AAC compression, converting to another compressed format may slightly affect quality
          </p>
        </div>
      </div>
    </div>
  );
};

export default M4aConverter; 