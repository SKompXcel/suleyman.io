import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read the LaTeX file from public directory
    const latexFilePath = path.join(process.cwd(), 'public', 'resume.tex');
    const latexContent = fs.readFileSync(latexFilePath, 'utf8');

    // Call your LaTeX compilation service
    const serviceUrl = process.env.NEXT_PUBLIC_LATEX_SERVICE_URL || 'http://35.183.61.73:3001';
    const compileEndpoint = `${serviceUrl}/compile`;
    
    const response = await fetch(compileEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: latexContent }),
    });

    if (!response.ok) {
      throw new Error(`LaTeX compilation failed: ${response.statusText}`);
    }

    // Get the PDF buffer and convert to base64
    const pdfBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(pdfBuffer).toString('base64');
    const pdfUrl = `data:application/pdf;base64,${base64}`;

    // Clean up auxiliary files
    cleanupAuxiliaryFiles();

    return res.status(200).json({ success: true, pdfUrl });
  } catch (error) {
    console.error('Error compiling LaTeX:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// Function to clean up LaTeX auxiliary files
function cleanupAuxiliaryFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  const auxiliaryExtensions = ['.aux', '.fdb_latexmk', '.fls', '.log', '.out', '.synctex.gz'];
  
  try {
    auxiliaryExtensions.forEach(ext => {
      const filePath = path.join(publicDir, `resume${ext}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up: ${filePath}`);
      }
    });
    console.log('LaTeX auxiliary files cleanup completed');
  } catch (err) {
    console.error('Error cleaning up auxiliary files:', err);
    // We don't throw the error as this is just cleanup
  }
}