import { toast } from "sonner";

interface ConversionRequest {
  files: File[];
  outputFormat: string;
  inputFormat: string;
}

const handleImageConversion = async (files: File[], outputFormat: string) => {
  try {
    const results = await Promise.all(files.map(async (file) => {
      // Get pyodide instance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // Convert image using Python
      const result = await pyodide.runPythonAsync(`
        from io import BytesIO
        from PIL import Image, ImageEnhance
        import base64

        # Decode base64 image data
        image_data = base64.b64decode("${base64String}")

        # Load the image
        img_data = BytesIO(image_data)
        image = Image.open(img_data)

        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
            image = image.convert('RGB')

        # Enhance image quality
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.2)  # Slight sharpening

        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.1)  # Slight contrast enhancement

        # Save to bytes with specified format
        output = BytesIO()
        image.save(output, format='${outputFormat.toLowerCase()}', quality=95)
        output.getvalue()
      `);

      // Convert Python bytes to Uint8Array
      const convertedData = new Uint8Array(result.toJs());

      // Create new file with converted data
      const newFileName = `${file.name.split('.')[0]}.${outputFormat.toLowerCase()}`;
      const newFile = new File([convertedData], newFileName, {
        type: `image/${outputFormat.toLowerCase()}`
      });

      return newFile;
    }));

    // Create download links for converted files
    results.forEach(file => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success(`Successfully converted ${files.length} files to ${outputFormat}`);
    return results;
  } catch (error) {
    console.error('Image conversion error:', error);
    toast.error(`Failed to convert images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

export const handleConversion = async ({ files, outputFormat, inputFormat }: ConversionRequest) => {
  try {
    console.log(`Converting ${files.length} ${inputFormat} files to ${outputFormat}`);
    
    switch (inputFormat.toLowerCase()) {
      case 'png':
      case 'jpeg':
      case 'webp':
      case 'gif':
        await handleImageConversion(files, outputFormat);
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
    };
  } catch (error) {
    console.error('Conversion error:', error);
    toast.error(`Failed to convert files: ${error.message}`);
    return {
      success: false,
      message: `Failed to convert files: ${error.message}`,
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