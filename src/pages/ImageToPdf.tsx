import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileImage } from "lucide-react";

const supportedFormats = [
  {
    ext: "PNG",
    description: "Convert PNG images to PDF format",
    path: "/image-to-pdf/png",
  },
  {
    ext: "JPEG",
    description: "Convert JPEG images to PDF format",
    path: "/image-to-pdf/jpeg",
  },
];

const ImageToPdf = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Image to PDF</h1>
      <p className="text-gray-600 mb-8">
        Select the image format you want to convert to PDF
      </p>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {supportedFormats.map((format) => (
          <Link key={format.ext} to={format.path}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileImage className="h-6 w-6 text-primary" />
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

export default ImageToPdf;