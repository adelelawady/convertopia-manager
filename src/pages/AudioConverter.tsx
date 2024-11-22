import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Music } from "lucide-react";

const supportedFormats = [
  {
    ext: "MP3",
    description: "Convert MP3 audio files to other formats",
    path: "/audio-converter/mp3",
  },
  {
    ext: "WAV",
    description: "Convert WAV audio files to other formats",
    path: "/audio-converter/wav",
  },
  {
    ext: "OGG",
    description: "Convert OGG audio files to other formats",
    path: "/audio-converter/ogg",
  },
  {
    ext: "M4A",
    description: "Convert M4A audio files to other formats",
    path: "/audio-converter/m4a",
  },
  {
    ext: "FLAC",
    description: "Convert FLAC audio files to other formats",
    path: "/audio-converter/flac",
  },
];

const AudioConverter = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Audio Converter</h1>
      <p className="text-gray-600 mb-8">
        Select the audio format you want to convert
      </p>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {supportedFormats.map((format) => (
          <Link key={format.ext} to={format.path}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-primary" />
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

export default AudioConverter;