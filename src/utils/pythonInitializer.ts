export const initializePython = async () => {
  try {
    // Load pyodide
    const pyodide = await loadPyodide();
    (window as any).pyodide = pyodide;

    // Install required packages
    await pyodide.loadPackage('micropip');
    const micropip = pyodide.pyimport('micropip');
    
    // Install Pillow for image processing
    await micropip.install('Pillow');
    
    // Install pydub for audio processing
    await micropip.install('pydub');
    
    // Import required modules
    await pyodide.runPythonAsync(`
      import PIL
      import pydub
      print('Python environment initialized with Pillow and pydub')
    `);

    console.log('Python environment ready');
    return true;
  } catch (error) {
    console.error('Failed to initialize Python environment:', error);
    return false;
  }
}; 