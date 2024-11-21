import FileUploader from "@/components/FileUploader";
import { toast } from "sonner";

const PdfToWord = () => {
  const handleConvert = (files: File[]) => {
    // Implement actual conversion logic here
    toast.success(`Converting ${files.length} files to Word format`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Word</h1>
      <p className="text-gray-600 mb-8">
        Convert your PDF files to editable Word documents
      </p>
      <FileUploader
        acceptedFileTypes={[".pdf"]}
        onConvert={handleConvert}
      />
    </div>
  );
};

export default PdfToWord;