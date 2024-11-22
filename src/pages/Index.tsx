import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Image, Music } from "lucide-react";

const converterCategories = [
  
  {
    title: "Image Converter",
    description: "Convert images between different formats",
    icon: Image,
    color: "bg-green-500",
    formats: [
      {
        ext: "PNG",
        description: "Convert PNG images",
        path: "/image-converter/png",
      },
      {
        ext: "JPEG",
        description: "Convert JPEG images",
        path: "/image-converter/jpeg",
      },
      {
        ext: "WEBP",
        description: "Convert WebP images",
        path: "/image-converter/webp",
      },
      {
        ext: "GIF",
        description: "Convert GIF images",
        path: "/image-converter/gif",
      },
      {
        ext: "ICO",
        description: "Convert Ico files",
        path: "/image-converter/ico",
      },
      {
        ext: "BMP",
        description: "Convert bmp images",
        path: "/image-converter/bmp",
      },
    ],
  },
  {
    title: "Document Converter",
    description: "Convert documents between different formats",
    icon: FileText,
    color: "bg-blue-500",
    formats: [
      {
        ext: "PDF",
        description: "Convert PDF documents",
        path: "/document-converter/pdf",
      },
      {
        ext: "DOC",
        description: "Convert DOC documents",
        path: "/document-converter/doc",
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
      {
        ext: "RTF",
        description: "Convert RTF documents",
        path: "/document-converter/rtf",
      },
    ],
  },
  {
    title: "Audio Converter",
    description: "Convert audio files between different formats",
    icon: Music,
    color: "bg-purple-500",
    formats: [
      {
        ext: "MP3",
        description: "Convert MP3 audio",
        path: "/audio-converter/mp3",
      },
      {
        ext: "WAV",
        description: "Convert WAV audio",
        path: "/audio-converter/wav",
      },
      {
        ext: "OGG",
        description: "Convert OGG audio",
        path: "/audio-converter/ogg",
      },
      {
        ext: "M4A",
        description: "Convert M4A audio",
        path: "/audio-converter/m4a",
      },
      {
        ext: "FLAC",
        description: "Convert FLAC audio",
        path: "/audio-converter/flac",
      },
    ],
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
          <p className="text-lg text-gray-600 mb-12">
            Convert your files to any format easily and securely
          </p>
        </div>

        {converterCategories.map((category) => (
          <div key={category.title} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${category.color}`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.formats.map((format) => (
                <Link key={format.path} to={format.path}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <category.icon className="h-6 w-6 text-primary" />
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
        ))}
      </div>
    </div>
  );
};

export default Index;