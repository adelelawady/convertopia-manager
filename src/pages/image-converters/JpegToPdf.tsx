import FileUploader from "@/components/FileUploader";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const JpegToPdf = () => {
  const handleConvert = (files: File[]) => {
    // Implement actual conversion logic here
    toast.success(`Converting ${files.length} JPEG files to PDF`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/image-to-pdf" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Image Formats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">JPEG to PDF</h1>
      <p className="text-gray-600 mb-8">
        Convert your JPEG images to PDF format
      </p>
      
      <FileUploader
        acceptedFileTypes={[".jpg", ".jpeg"]}
        onConvert={handleConvert}
      />
    </div>
  );
};

export default JpegToPdf;