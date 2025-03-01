
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="bg-black/30 backdrop-blur-md border border-gray-700 rounded-lg p-8 max-w-md mx-auto text-center animate-fade-in">
        <div className="inline-block p-4 rounded-full bg-gray-800/70 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-gray-400"
          >
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
            <path d="M17 4h4v4" />
            <path d="M11 8h10v10" />
            <path d="M21 12v6h-6" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">Page not found</p>
        <Button 
          variant="outline" 
          className="hover:bg-white hover:text-black transition-colors"
          onClick={() => window.location.href = "/"}
        >
          Return to Base
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
