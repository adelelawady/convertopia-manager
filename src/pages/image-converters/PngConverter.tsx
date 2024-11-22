import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUploader from "@/components/FileUploader";
import { handleConversion } from "@/utils/conversionHandler";
import { usePyodide } from "@/hooks/usePyodide";
import { toast } from "react-hot-toast";

const outputFormats = [
  { value: "jpg", label: "JPG" },
  { value: "webp", label: "WebP" },
  { value: "gif", label: "GIF" },
  { value: "pdf", label: "PDF" },
];

const PngConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState(outputFormats[0].value);
  const { runPythonCode } = usePyodide();

  const handleConvert = async (files: File[]) => {
    try {
      // Example Python code for image conversion
      const pythonCode = `
        from PIL import Image
        import io
        
        def convert_image(image_data, output_format):
            # Convert image data to PIL Image
            img = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img = img.convert('RGB')
            
            # Save to bytes
            output = io.BytesIO()
            img.save(output, format=output_format)
            return output.getvalue()
      `;

      await runPythonCode(pythonCode);

      await handleConversion({
        files,
        outputFormat: selectedFormat.toUpperCase(),
        inputFormat: "PNG"
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert image');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/image-converter" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Image Formats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">PNG Converter</h1>
      <p className="text-gray-600 mb-8">
        Convert your PNG images to other formats
      </p>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {outputFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PNG Files
          </label>
          <FileUploader
            acceptedFileTypes={[".png"]}
            onConvert={handleConvert}
          />
        </div>
      </div>
    </div>
  );
};

export default PngConverter; 