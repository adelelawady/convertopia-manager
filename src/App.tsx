import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import ImageConverter from "./pages/ImageConverter";
import AudioConverter from "./pages/AudioConverter";
import DocumentConverter from "./pages/DocumentConverter";

// Image Converters
import PngConverter from "./pages/image-converters/PngConverter";
import JpgConverter from "./pages/image-converters/JpgConverter";
import WebpConverter from "./pages/image-converters/WebpConverter";
import GifConverter from "./pages/image-converters/GifConverter";

// Audio Converters
import Mp3Converter from "./pages/audio-converters/Mp3Converter";
import WavConverter from "./pages/audio-converters/WavConverter";
import OggConverter from "./pages/audio-converters/OggConverter";
import M4aConverter from "./pages/audio-converters/M4aConverter";
import FlacConverter from "./pages/audio-converters/FlacConverter";

// Document Converters
import PdfConverter from "./pages/document-converters/PdfConverter";
import DocConverter from "./pages/document-converters/DocConverter";
import DocxConverter from "./pages/document-converters/DocxConverter";
import TxtConverter from "./pages/document-converters/TxtConverter";
import RtfConverter from "./pages/document-converters/RtfConverter";

import { PyodideProvider } from "@/components/PyodideLoader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PyodideProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Main converter routes */}
                <Route path="/image-converter" element={<ImageConverter />} />
                <Route path="/audio-converter" element={<AudioConverter />} />
                <Route path="/document-converter" element={<DocumentConverter />} />

                {/* Image converter sub-routes */}
                <Route path="/image-converter/png" element={<PngConverter />} />
                <Route path="/image-converter/jpg" element={<JpgConverter />} />
                <Route path="/image-converter/webp" element={<WebpConverter />} />
                <Route path="/image-converter/gif" element={<GifConverter />} />

                {/* Audio converter sub-routes */}
                <Route path="/audio-converter/mp3" element={<Mp3Converter />} />
                <Route path="/audio-converter/wav" element={<WavConverter />} />
                <Route path="/audio-converter/ogg" element={<OggConverter />} />
                <Route path="/audio-converter/m4a" element={<M4aConverter />} />
                <Route path="/audio-converter/flac" element={<FlacConverter />} />

                {/* Document converter sub-routes */}
                <Route path="/document-converter/pdf" element={<PdfConverter />} />
                <Route path="/document-converter/doc" element={<DocConverter />} />
                <Route path="/document-converter/docx" element={<DocxConverter />} />
                <Route path="/document-converter/txt" element={<TxtConverter />} />
                <Route path="/document-converter/rtf" element={<RtfConverter />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PyodideProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;