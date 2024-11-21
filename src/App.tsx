import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import PdfToWord from "./pages/PdfToWord";
import ImageToPdf from "./pages/ImageToPdf";
import WordToPdf from "./pages/WordToPdf";
import PngToPdf from "./pages/image-converters/PngToPdf";
import JpegToPdf from "./pages/image-converters/JpegToPdf";
import DocToPdf from "./pages/word-converters/DocToPdf";
import DocxToPdf from "./pages/word-converters/DocxToPdf";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pdf-to-word" element={<PdfToWord />} />
              <Route path="/image-to-pdf" element={<ImageToPdf />} />
              <Route path="/word-to-pdf" element={<WordToPdf />} />
              <Route path="/image-to-pdf/png" element={<PngToPdf />} />
              <Route path="/image-to-pdf/jpeg" element={<JpegToPdf />} />
              <Route path="/word-to-pdf/doc" element={<DocToPdf />} />
              <Route path="/word-to-pdf/docx" element={<DocxToPdf />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;