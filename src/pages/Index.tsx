import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const basename = import.meta.env.DEV ? '' : '/convertopia-manager';

const converterCategories = [
  {
    disabled: false,
    title: "Image Converter",
    description: "Convert images between different formats while maintaining quality",
    icon: `${basename}/icons/image-icon.svg`,
    color: "bg-green-500",
    features: [
      "High-quality conversion",
      "Preserves image metadata",
      "Batch processing support"
    ],
    formats: [
      {
        ext: "PNG",
        description: "Lossless compression with transparency",
        path: "/image-converter/png",
        icon: `${basename}/icons/png-icon.svg`
      },
      {
        ext: "JPEG",
        description: "Optimized for photographs",
        path: "/image-converter/jpeg",
        icon: `${basename}/icons/jpg-icon.svg`
      },
      {
        ext: "WEBP",
        description: "Modern format with excellent compression",
        path: "/image-converter/webp",
        icon: `${basename}/icons/webp-icon.svg`
      },
      {
        ext: "GIF",
        description: "Perfect for animations",
        path: "/image-converter/gif",
        icon: `${basename}/icons/gif-icon.svg`
      },
      {
        ext: "ICO",
        description: "Create favicon icons",
        path: "/image-converter/ico",
        icon: `${basename}/icons/ico-icon.svg`
      },
      {
        ext: "BMP",
        description: "Basic bitmap format",
        path: "/image-converter/bmp",
        icon: `${basename}/icons/bmp-icon.svg`
      },
    ],
  },
  {
    disabled: true,
    title: "Document Converter",
    description: "Convert documents between different formats with formatting preserved",
    icon: `${basename}/icons/document-icon.svg`,
    color: "bg-blue-500",
    features: [
      "Maintains formatting",
      "Fast conversion",
      "Multiple file support"
    ],
    formats: [
      {
        ext: "PDF",
        description: "Universal document format",
        path: "/document-converter/pdf",
        icon: `${basename}/icons/pdf-icon.svg`
      },
      {
        ext: "DOC",
        description: "Microsoft Word format",
        path: "/document-converter/doc",
        icon: `${basename}/icons/doc-icon.svg`
      },
      {
        ext: "DOCX",
        description: "Modern Word format",
        path: "/document-converter/docx",
        icon: `${basename}/icons/doc-icon.svg`
      },
      {
        ext: "TXT",
        description: "Plain text format",
        path: "/document-converter/txt",
        icon: `${basename}/icons/txt-icon.svg`
      },
      {
        ext: "RTF",
        description: "Rich Text Format",
        path: "/document-converter/rtf",
        icon: `${basename}/icons/rtf-icon.svg`
      },
    ],
  },
  {
    disabled: false,
    title: "Audio Converter",
    description: "Convert audio files between formats while preserving quality",
    icon: `${basename}/icons/audio-icon.svg`,
    color: "bg-purple-500",
    features: [
      "High-quality audio conversion",
      "Multiple format support",
      "Preserves metadata"
    ],
    formats: [
      {
        ext: "MP3",
        description: "Universal audio format",
        path: "/audio-converter/mp3",
        icon: `${basename}/icons/mp3-icon.svg`
      },
      {
        ext: "WAV",
        description: "Lossless audio format",
        path: "/audio-converter/wav",
        icon: `${basename}/icons/wav-icon.svg`
      },
      {
        ext: "OGG",
        description: "Open source audio format",
        path: "/audio-converter/ogg",
        icon: `${basename}/icons/ogg-icon.svg`
      },
      {
        ext: "M4A",
        description: "AAC audio format",
        path: "/audio-converter/m4a",
        icon: `${basename}/icons/m4a-icon.svg`
      },
      {
        ext: "FLAC",
        description: "Lossless compression format",
        path: "/audio-converter/flac",
        icon: `${basename}/icons/flac-icon.svg`
      },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convertopia Manager
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Convert your files to any format easily and securely
          </p>
        </div>

        {converterCategories.map((category) => !category.disabled && (
          <div key={category.title} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-lg ${category.color}`}>
                <img 
                  src={category.icon} 
                  alt={`${category.title} icon`}
                  className="h-6 w-6"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
                <p className="text-gray-600 mt-1">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.formats.map((format) => (
                <Link key={format.path} to={format.path}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <div className={`${category.color} bg-opacity-10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <img 
                          src={format.icon}
                          alt={format.ext}
                          className="h-6 w-6 opacity-75"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {format.ext}
                        </h3>
                        <p className="text-gray-600 text-sm">{format.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Index;