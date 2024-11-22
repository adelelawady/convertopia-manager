import { useEffect, useState } from 'react';

interface PyodideInstance {
  runPython: (code: string) => any;
  loadPackage: (packages: string[]) => Promise<void>;
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<PyodideInstance | null>(null);

  useEffect(() => {
    const pyodideInstance = (window as any).pyodide;
    if (pyodideInstance) {
      setPyodide(pyodideInstance);
    }
  }, []);

  const runPythonCode = async (code: string) => {
    if (!pyodide) {
      throw new Error('Pyodide is not initialized');
    }
    return await pyodide.runPython(code);
  };

  return { runPythonCode, pyodide };
}; 