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

        # For ICO files, get the largest size
        if image.format == 'ICO':
            try:
                sizes = list(image.info.get('sizes', [(image.width, image.height)]))
                largest_size = max(sizes, key=lambda x: x[0] * x[1])
                for size in image.info.get('sizes', []):
                    if size == largest_size:
                        image.size = size
                        image.load()
                        break
            except Exception as e:
                print(f"Error handling ICO sizes: {e}")
                pass

        # Handle color modes
        if image.mode == 'P':
            if 'transparency' in image.info:
                image = image.convert('RGBA')
            else:
                image = image.convert('RGB')
        elif image.mode == '1':  # Binary (black and white)
            image = image.convert('RGB')
        elif image.mode in ('LA', 'L'):  # Grayscale with/without alpha
            image = image.convert('RGBA' if 'A' in image.mode else 'RGB')
        elif image.mode == 'RGBA' and output_format.upper() == 'JPEG':
            image = image.convert('RGB')

        # Prepare output
        output = BytesIO()
        output_format = '${outputFormat.toUpperCase()}'

        if output_format == "PNG":
            image.save(output, 
                      format="PNG", 
                      optimize=True,
                      compress_level=9)

        elif output_format == "JPEG":
            image.save(output, 
                      format="JPEG", 
                      quality=95,
                      optimize=True,
                      progressive=True)

        elif output_format == "WEBP":
            image.save(output, 
                      format="WEBP", 
                      quality=90,
                      method=6,
                      lossless=False)

        elif output_format == "GIF":
            image = image.convert('P', palette=Image.Palette.ADAPTIVE, colors=256)
            image.save(output, 
                      format="GIF",
                      optimize=True)

        elif output_format == "ICO":
            image.save(output, 
                      format="ICO",
                      sizes=[(32, 32), (48, 48), (64, 64)])

        elif output_format == "BMP":
            image.save(output, 
                      format="BMP")

        # Return the output bytes
        output.getvalue()
      `);

      // Convert Python bytes to Uint8Array
      const convertedData = new Uint8Array(result.toJs());

      // Create new file with converted data
      const newFileName = `${file.name.split('.')[0]}.${outputFormat.toLowerCase()}`;
      const mimeTypes = {
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif',
        'ico': 'image/x-icon',
        'bmp': 'image/bmp'
      };

      const newFile = new File([convertedData], newFileName, {
        type: mimeTypes[outputFormat.toLowerCase()] || `image/${outputFormat.toLowerCase()}`
      });

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
      case 'ico':
      case 'bmp':
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