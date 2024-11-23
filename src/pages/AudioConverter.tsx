import { Link } from "react-router-dom";
import { Music } from "lucide-react";

const basename = import.meta.env.DEV ? '' : '/convertopia-manager';

interface ConverterCard {
  title: string;
  description: string;
  path: string;
  icon: string;
  formats: string[];
  features: string[];
}

const AudioConverter = () => {
  const converters: ConverterCard[] = [
    {
      title: "MP3 Converter",
      description: "Convert MP3 files to other audio formats",
      path: "/audio-converter/mp3",
      icon: `${basename}/icons/mp3-icon.svg`,
      formats: ["WAV", "OGG", "M4A", "FLAC"],
      features: [
        "High quality conversion",
        "Multiple file support",
        "Fast processing"
      ]
    },
    {
      title: "WAV Converter",
      description: "Convert WAV files to compressed formats",
      path: "/audio-converter/wav",
      icon: `${basename}/icons/wav-icon.svg`,
      formats: ["MP3", "OGG", "M4A", "FLAC"],
      features: [
        "Lossless conversion",
        "Preserve audio quality",
        "Professional formats"
      ]
    },
    {
      title: "OGG Converter",
      description: "Convert OGG files to other formats",
      path: "/audio-converter/ogg",
      icon: `${basename}/icons/ogg-icon.svg`,
      formats: ["MP3", "WAV", "M4A", "FLAC"],
      features: [
        "Open source format",
        "High compression",
        "Quality settings"
      ]
    },
    {
      title: "M4A Converter",
      description: "Convert M4A files to other formats",
      path: "/audio-converter/m4a",
      icon: `${basename}/icons/m4a-icon.svg`,
      formats: ["MP3", "WAV", "OGG", "FLAC"],
      features: [
        "AAC audio support",
        "Apple format",
        "Streaming ready"
      ]
    },
    {
      title: "FLAC Converter",
      description: "Convert FLAC files while preserving quality",
      path: "/audio-converter/flac",
      icon: `${basename}/icons/flac-icon.svg`,
      formats: ["MP3", "WAV", "OGG", "M4A"],
      features: [
        "Lossless compression",
        "Perfect quality",
        "Professional audio"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Audio Format Converter
        </h1>
        <p className="text-lg text-gray-600">
          Convert your audio files between different formats while maintaining quality
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {converters.map((converter, index) => (
          <Link
            key={index}
            to={converter.path}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={converter.icon}
                  alt={converter.title}
                  className="w-12 h-12 mr-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {converter.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                {converter.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Supported Formats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {converter.formats.map((format, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Features
                  </h4>
                  <ul className="text-sm text-gray-500 list-disc list-inside">
                    {converter.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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

export default AudioConverter;