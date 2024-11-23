import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import { toast } from "sonner";
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
const pdfjsWorker = new URL('pdfjs-dist/build/pdf.worker.js', import.meta.url);

import {Buffer} from 'Buffer';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useState, useRef } from "react";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

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
        convertedFiles = await handleDocumentConversion(files, outputFormat);
        break;
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'm4a':
      case 'flac':
        convertedFiles = await handleAudioConversion(files, outputFormat);
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
const handleDocumentConversion = async (files: File[], outputFormat: string): Promise<ConvertedFile[]> => {
  try {
    const results = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      let convertedData: ArrayBuffer;
      
      if (file.name.toLowerCase().endsWith('.pdf') && outputFormat.toLowerCase() === 'doc') {
        // Load PDF document using PDF.js
        const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
        const pdfDoc = await loadingTask.promise;
        let textContent = '';

        // Extract text from all pages
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => item.str)
            .join(' ');
          textContent += pageText + '\n\n';
        }

        // Create RTF content (simpler format that works better for basic text)
        const rtfContent = `{\\rtf1\\ansi\\deff0
          {\\fonttbl{\\f0\\froman Times New Roman;}}
          \\viewkind4\\uc1\\pard\\f0\\fs24
          ${textContent.split('\n').map(line => 
            line.trim() ? `${line}\\par` : ''
          ).join('\n')}
        }`;

        // Convert the RTF content to ArrayBuffer
        const encoder = new TextEncoder();
        convertedData = encoder.encode(rtfContent).buffer;

      } else if (file.name.toLowerCase().endsWith('.doc') && outputFormat.toLowerCase() === 'pdf') {
        // Create PDF directly from text content
        const decoder = new TextDecoder();
        const text = decoder.decode(arrayBuffer);

        // Create PDF
        const pdf = new jsPDF();
        const splitText = pdf.splitTextToSize(text, 180); // Split text to fit page width
        
        let y = 20; // Starting y position
        
        for (const line of splitText) {
          if (y > 280) { // Check if we need a new page
            pdf.addPage();
            y = 20;
          }
          
          pdf.text(line, 15, y);
          y += 7; // Line spacing
        }

        convertedData = pdf.output('arraybuffer');
      } else {
        throw new Error(`Unsupported conversion: ${file.name} to ${outputFormat}`);
      }

      // Create new file with converted data
      const newFileName = `${file.name.split('.')[0]}.${outputFormat.toLowerCase()}`;
      const mimeTypes = {
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'rtf': 'application/rtf'
      };

      const newFile = new File([convertedData], newFileName, {
        type: mimeTypes[outputFormat.toLowerCase()]
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
    console.error('Document conversion error:', error);
    toast.error(`Failed to convert documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// Create a singleton FFmpeg instance
const ffmpeg = new FFmpeg();
let loaded = false;

const loadFFmpeg = async () => {
  if (loaded) return;

  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
  
  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
  });

  loaded = true;
};

const handleAudioConversion = async (files: File[], outputFormat: string): Promise<ConvertedFile[]> => {
  try {
    await loadFFmpeg();

    const results = await Promise.all(files.map(async (file) => {
      const inputFileName = `input-${Date.now()}.${file.name.split('.').pop()}`;
      const outputFileName = `output-${Date.now()}.${outputFormat.toLowerCase()}`;

      try {
        // Write input file
        await ffmpeg.writeFile(inputFileName, await fetchFile(file));

        // Set conversion arguments based on format
        const ffmpegArgs = ['-i', inputFileName];
        
        // Add input format specific settings for WAV
        if (file.name.toLowerCase().endsWith('.wav')) {
          ffmpegArgs.push('-ar', '44100'); // Set sample rate
        }
        
        // Output format specific settings
        switch (outputFormat.toLowerCase()) {
          case 'mp3':
            ffmpegArgs.push(
              '-c:a', 'libmp3lame',
              '-q:a', '2',  // Quality setting (0-9, lower is better)
              '-joint_stereo', '1'  // Use joint stereo
            );
            break;
          case 'ogg':
            ffmpegArgs.push(
              '-c:a', 'libvorbis',
              '-q:a', '6',  // Quality setting (0-10, higher is better)
              '-compression_level', '10'  // Maximum compression
            );
            break;
          case 'm4a':
            ffmpegArgs.push(
              '-c:a', 'aac',
              '-b:a', '192k',  // Bitrate
              '-profile:a', 'aac_low'  // AAC profile
            );
            break;
          case 'flac':
            ffmpegArgs.push(
              '-c:a', 'flac',
              '-compression_level', '12'  // Maximum compression
            );
            break;
          case 'wav':
            ffmpegArgs.push(
              '-c:a', 'pcm_s16le',  // 16-bit PCM
              '-ar', '44100'  // CD quality sample rate
            );
            break;
          default:
            throw new Error(`Unsupported output format: ${outputFormat}`);
        }
        
        ffmpegArgs.push(outputFileName);

        // Run conversion
        await ffmpeg.exec(ffmpegArgs);

        // Read output file
        const data = await ffmpeg.readFile(outputFileName);
        
        if (!(data instanceof Uint8Array)) {
          throw new Error('Converted file data is not in the expected format');
        }

        // Create output file
        const newFileName = `${file.name.split('.')[0]}.${outputFormat.toLowerCase()}`;
        const mimeTypes = {
          'wav': 'audio/wav',
          'ogg': 'audio/ogg',
          'm4a': 'audio/mp4',
          'flac': 'audio/flac',
          'mp3': 'audio/mpeg'
        };

        const newFile = new File([data], newFileName, {
          type: mimeTypes[outputFormat.toLowerCase()] || `audio/${outputFormat.toLowerCase()}`
        });

        // Cleanup
        await ffmpeg.deleteFile(inputFileName);
        await ffmpeg.deleteFile(outputFileName);

        const url = URL.createObjectURL(newFile);

        return {
          file: newFile,
          url,
          originalName: file.name,
          outputFormat: outputFormat.toLowerCase()
        };

      } catch (error) {
        console.error('Error converting file:', file.name, error);
        throw error;
      }
    }));

    toast.success(`Successfully converted ${files.length} files to ${outputFormat}`);
    return results;

  } catch (error) {
    console.error('Audio conversion error:', error);
    toast.error(`Failed to convert audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}; 