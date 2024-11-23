import { useState, useEffect } from 'react';
import { loadPyodide } from 'pyodide';
import { Loader2 } from 'lucide-react';

interface PyodideLoaderProps {
  children: React.ReactNode;
}

export const PyodideProvider = ({ children }: PyodideLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPyodideEnvironment = async () => {
      try {
        setIsLoading(true);
        const pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });

        // Load required Python packages
        await pyodide.loadPackage(['numpy', 'pillow', 'micropip','pandas']);

        // Initialize the Python environment with required functions
        await pyodide.runPythonAsync(`
          import micropip
          await micropip.install("pillow")
        `);
        console.log('Pillow installed.');

        // Make pyodide instance globally available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).pyodide = pyodide;

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load Pyodide:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Python environment');
        setIsLoading(false);
      }
    };

    loadPyodideEnvironment();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xl font-semibold">
            Failed to load Python environment
          </div>
          <div className="text-gray-600">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <div className="text-gray-600">
            Loading Python Environment...
          </div>
          <div className="text-sm text-gray-500">
            This might take a few moments
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 