import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json(); // If content is passed directly, though usage suggests it reads from file
    
    // Read the LaTeX file from public directory
    const latexFilePath = path.join(process.cwd(), 'public', 'resume.tex');
    let latexContent = '';
    
    if (fs.existsSync(latexFilePath)) {
         latexContent = fs.readFileSync(latexFilePath, 'utf8');
    } else {
         // If file doesn't exist, maybe it relies on content passed in body?
         // The original code read from file.
         if (!content && !fs.existsSync(latexFilePath)) {
             return NextResponse.json({ error: 'Resume source file not found' }, { status: 404 });
         }
         latexContent = content;
    }


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

    // Clean up auxiliary files (optional in this context since we are just reading, but keeping logic)
    cleanupAuxiliaryFiles();

    return NextResponse.json({ success: true, pdfUrl });
  } catch (error: any) {
    console.error('Error compiling LaTeX:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
