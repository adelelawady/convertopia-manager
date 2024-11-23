import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
 
    <footer className="bg-white border-t border-gray-200 mt-auto">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-6">
          <Link 
            to="/privacy-policy"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link 
            to="/terms-of-service"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500 animate-pulse" />
          <span>by</span>
          <a 
            href="https://github.com/adelelawady" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Adel Elawady
          </a>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} AdelElawady. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;