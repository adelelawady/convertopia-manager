import FileUploader from "@/components/FileUploader";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const DocToPdf = () => {
  const handleConvert = (files: File[]) => {
    // Implement actual conversion logic here
    toast.success(`Converting ${files.length} DOC files to PDF`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/word-to-pdf" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Word Formats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">DOC to PDF</h1>
      <p className="text-gray-600 mb-8">
        Convert your DOC documents to PDF format
      </p>
      
      <FileUploader
        acceptedFileTypes={[".doc"]}
        onConvert={handleConvert}
      />
    </div>
  );
};

export default DocToPdf;