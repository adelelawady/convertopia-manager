import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const ImageConverter = () => {
  const converters = [
    {
      title: "PNG Converter",
      description: "Convert PNG images to JPEG, WebP, or GIF formats",
      path: "/image-converter/png",
      icon: "/icons/png-icon.svg",
      formats: ["JPEG", "WebP", "GIF"],
      features: [
        "Lossless compression",
        "Transparency support",
        "High quality output"
      ]
    },
    {
      title: "JPEG Converter",
      description: "Convert JPEG images to PNG, WebP, or GIF formats",
      path: "/image-converter/jpeg",
      icon: "/icons/jpg-icon.svg",
      formats: ["PNG", "WebP", "GIF","Ico","Bmp"],
      features: [
        "Optimized compression",
        "Fast conversion",
        "Wide compatibility"
      ]
    },
    {
      title: "WebP Converter",
      description: "Convert WebP images to PNG, JPEG, or GIF formats",
      path: "/image-converter/webp",
      icon: "/icons/webp-icon.svg",
      formats: ["PNG", "JPEG", "GIF","Ico","Bmp"],
      features: [
        "Modern format",
        "Excellent compression",
        "Quality preservation"
      ]
    },
    {
      title: "GIF Converter",
      description: "Convert GIF images to PNG, JPEG, or WebP formats",
      path: "/image-converter/gif",
      icon: "/icons/gif-icon.svg",
      formats: ["PNG", "JPEG", "WebP","ico","Bmp"],
      features: [
        "Animation support",
        "Frame extraction",
        "Format flexibility"
      ]
    }
    ,
    {
      title: "Ico Converter",
      description: "Convert Ico images to PNG, JPEG, or WebP formats",
      path: "/image-converter/ico",
      icon: "/icons/ico-icon.svg",
      formats: ["PNG", "JPEG", "WebP","gif","Bmp"],
      features: [
        "Animation support",
        "Frame extraction",
        "Format flexibility"
      ]
    }
    ,
    {
      title: "Bmp Converter",
      description: "Convert Bmp images to PNG, JPEG, or WebP formats",
      path: "/image-converter/bmp",
      icon: "/icons/bmp-icon.svg",
      formats: ["PNG", "JPEG", "WebP","gif","ico"],
      features: [
        "Animation support",
        "Frame extraction",
        "Format flexibility"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Image Format Converter
        </h1>
        <p className="text-lg text-gray-600">
          Convert your images between different formats while maintaining quality
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {converters.map((converter) => (
          <Link key={converter.path} to={converter.path}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-center h-20">
                  <img 
                    src={converter.icon} 
                    alt={converter.title}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  {converter.title}
                </h2>
                
                <p className="text-gray-600 text-sm text-center">
                  {converter.description}
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Output Formats:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {converter.formats.map((format) => (
                        <span
                          key={format}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Features:
                    </span>
                    <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                      {converter.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          All conversions are processed locally in your browser for maximum privacy and speed
        </p>
      </div>
    </div>
  );
};

export default ImageConverter;