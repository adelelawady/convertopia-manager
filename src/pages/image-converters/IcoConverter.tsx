import { useState } from 'react';
import { handleConversion } from '@/utils/conversionHandler';
import { FileUploader } from '@/components/FileUploader';
import { ArrowLeft } from 'lucide-react';
import { Link } from "react-router-dom";

const IcoConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState('png');

  const handleConvert = async (files: File[]) => {
    return await handleConversion({
      files,
      outputFormat: selectedFormat,
      inputFormat: 'ICO'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/image-converter" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Image Formats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">ICO Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your ICO files to other image formats
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
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
            <option value="gif">GIF</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload ICO Files
          </label>
          <FileUploader
            acceptedFileTypes={[".ico"]}
            maxFiles={10}
            onConvert={handleConvert}
            outputFormat={selectedFormat}
          />
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <h3 className="font-medium text-gray-700 mb-2">About ICO Conversion</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>ICO to PNG: Best for preserving transparency and quality</li>
            <li>ICO to JPEG: Suitable for web use without transparency</li>
            <li>ICO to WebP: Modern format with excellent compression</li>
            <li>ICO to GIF: Good for simple animations or icons</li>
          </ul>
          <p className="mt-2 text-yellow-600">
            Note: For multi-size ICO files, the largest size will be converted
          </p>
        </div>
      </div>
    </div>
  );
};

export default IcoConverter; 