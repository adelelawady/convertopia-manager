import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const supportedFormats = [
  {
    ext: "PDF",
    description: "Convert PDF documents",
    path: "/document-converter/pdf",
  },
  {
    ext: "DOCX",
    description: "Convert DOCX documents",
    path: "/document-converter/docx",
  },
  {
    ext: "TXT",
    description: "Convert TXT documents",
    path: "/document-converter/txt",
  },
];

const DocumentConverter = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Document Converter</h1>
      <p className="text-gray-600 mb-8">
        Select the document format you want to convert
      </p>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {supportedFormats.map((format) => (
          <Link key={format.ext} to={format.path}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {format.ext}
              </h3>
              <p className="text-gray-600">{format.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DocumentConverter;