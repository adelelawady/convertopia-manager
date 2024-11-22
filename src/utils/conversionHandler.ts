import { toast } from "sonner";

interface ConversionRequest {
  files: File[];
  outputFormat: string;
  inputFormat: string;
}

export interface ConvertedFile {
  file: File;
  url: string;
  originalName: string;
  outputFormat: string;
}

const handleImageConversion = async (files: File[], outputFormat: string): Promise<ConvertedFile[]> => {
  try {
    const results = await Promise.all(files.map(async (file) => {
      // Get pyodide instance
      const pyodide = (window as any).pyodide;
      if (!pyodide) {
        throw new Error('Python environment not initialized');
      }

      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64String = btoa(
        Array.from(uint8Array)
          .map(byte => String.fromCharCode(byte))
          .join('')
      );

      // Convert image using Python with format-specific optimizations
      const result = await pyodide.runPythonAsync(`
        from io import BytesIO
        from PIL import Image
        import base64

        # Decode base64 image data
        image_data = base64.b64decode("${base64String}")

        # Load the image
        img_data = BytesIO(image_data)
        image = Image.open(img_data)

        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
            image = image.convert('RGB')

        # Prepare output
        output = BytesIO()
        output_format = '${outputFormat.toUpperCase()}'

        if output_format == "PNG":
            # PNG optimization
            image.save(output, 
                      format="PNG", 
                      optimize=True,
                      compress_level=9)  # Maximum compression

        elif output_format == "JPEG":
            # JPEG optimization
            image.save(output, 
                      format="JPEG", 
                      quality=95,  # High quality
                      optimize=True,
                      progressive=True)  # Progressive loading

        elif output_format == "WEBP":
            # WebP optimization
            image.save(output, 
                      format="WEBP", 
                      quality=90,  # Good balance of quality and compression
                      method=6,    # Highest compression method
                      lossless=False)

        elif output_format == "GIF":
            # GIF optimization
            image = image.convert('P', palette=Image.Palette.ADAPTIVE, colors=256)
            image.save(output, 
                      format="GIF",
                      optimize=True)

        # Return the output bytes
        output.getvalue()
      `);

      // Convert Python bytes to Uint8Array
      const convertedData = new Uint8Array(result.toJs());

      // Create new file with converted data
      const newFileName = `${file.name.split('.')[0]}.${outputFormat.toLowerCase()}`;
      const mimeTypes = {
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif'
      };

      const newFile = new File([convertedData], newFileName, {
        type: mimeTypes[outputFormat.toLowerCase()] || `image/${outputFormat.toLowerCase()}`
      });

      // Create object URL for the file
      const url = URL.createObjectURL(newFile);

      return {
        file: newFile,
        url,
        originalName: file.name,
        outputFormat: outputFormat.toLowerCase()
      };
    }));

    toast.success(`Successfully converted ${files.length} files to ${outputFormat}`);
    return results;
  } catch (error) {
    console.error('Image conversion error:', error);
    toast.error(`Failed to convert images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// Helper function to download a converted file
export const downloadConvertedFile = (convertedFile: ConvertedFile) => {
  const a = document.createElement('a');
  a.href = convertedFile.url;
  a.download = convertedFile.file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Helper function to cleanup URLs when they're no longer needed
export const cleanupConvertedFile = (convertedFile: ConvertedFile) => {
  URL.revokeObjectURL(convertedFile.url);
};

export const handleConversion = async ({ files, outputFormat, inputFormat }: ConversionRequest) => {
  try {
    console.log(`Converting ${files.length} ${inputFormat} files to ${outputFormat}`);
    
    let convertedFiles: ConvertedFile[] = [];
    
    switch (inputFormat.toLowerCase()) {
      case 'png':
      case 'jpeg':
      case 'webp':
      case 'gif':
        convertedFiles = await handleImageConversion(files, outputFormat);
        break;
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
        await handleDocumentConversion(files, outputFormat);
        break;
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'm4a':
      case 'flac':
        await handleAudioConversion(files, outputFormat);
        break;
      default:
        throw new Error(`Unsupported input format: ${inputFormat}`);
    }

    return {
      success: true,
      message: `Converted ${files.length} files from ${inputFormat} to ${outputFormat}`,
      convertedFiles
    };
  } catch (error) {
    console.error('Conversion error:', error);
    toast.error(`Failed to convert files: ${error.message}`);
    return {
      success: false,
      message: `Failed to convert files: ${error.message}`,
      convertedFiles: []
    };
  }
};

// Simulated conversion handlers for different file types
const handleDocumentConversion = async (files: File[], outputFormat: string) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`Processing ${files.length} document files to ${outputFormat}`);
};

const handleAudioConversion = async (files: File[], outputFormat: string) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Processing ${files.length} audio files to ${outputFormat}`);
}; 