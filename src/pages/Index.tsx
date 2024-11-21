import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Image, File } from "lucide-react";

const converters = [
  {
    title: "PDF to Word",
    description: "Convert PDF files to editable Word documents",
    icon: FileText,
    path: "/pdf-to-word",
    color: "bg-blue-500",
  },
  {
    title: "Image to PDF",
    description: "Convert images to PDF documents",
    icon: Image,
    path: "/image-to-pdf",
    color: "bg-green-500",
  },
  {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format",
    icon: File,
    path: "/word-to-pdf",
    color: "bg-purple-500",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            File Converter
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Convert your files to any format easily and securely
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {converters.map((converter) => (
            <Link key={converter.path} to={converter.path}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div
                  className={`${converter.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <converter.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {converter.title}
                </h3>
                <p className="text-gray-600">{converter.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;