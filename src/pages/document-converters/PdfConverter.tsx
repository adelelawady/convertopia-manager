import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import FileUploader from "@/components/FileUploader";
import { handleConversion } from "@/utils/conversionHandler";

const PdfConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState('doc');

  const handleConvert = async (files: File[]) => {
    return await handleConversion({
      files,
      outputFormat: selectedFormat,
      inputFormat: 'PDF'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/document-converter" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Document Formats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your PDF documents to other formats while preserving layout and formatting
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
            <option value="doc">DOC</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="rtf">RTF</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF Files
          </label>
          <FileUploader
            acceptedFileTypes={[".pdf"]}
            maxFiles={10}
            onConvert={handleConvert}
            outputFormat={selectedFormat}
          />
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <h3 className="font-medium text-gray-700 mb-2">About PDF Conversion</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>PDF to DOC/DOCX: Converts while maintaining formatting and images</li>
            <li>PDF to TXT: Extracts plain text content</li>
            <li>PDF to RTF: Preserves basic formatting and structure</li>
          </ul>
          <p className="mt-2 text-yellow-600">
            Note: Complex PDF layouts may not convert perfectly in all cases
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfConverter; 