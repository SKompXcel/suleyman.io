'use client';

import { useState, useEffect } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { SimpleLayout } from '@/components/SimpleLayout';
import { HiDownload } from 'react-icons/hi'; // Using Hero Icons from React Icons
import Image from 'next/image';
import Link from 'next/link';

export default function Resume() {
  const [pdfUrl, setPdfUrl] = useState('/Suleyman_Kiani_RESUME_2025.pdf'); // Default fallback PDF
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function compileLaTeX() {
      try {
        setLoading(true);
        const response = await fetch('/api/compile-latex', { method: 'POST' });
        const data = await response.json();
        
        if (data.success && data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        } else {
          console.warn('Failed to compile LaTeX, using fallback PDF', data.error);
          // Keep using the fallback PDF
        }
      } catch (err) {
        console.error('Error during LaTeX compilation:', err);
        setError('Failed to compile resume. Using fallback version.');
        // Keep using the fallback PDF
      } finally {
        setLoading(false);
      }
    }

    compileLaTeX();
  }, []);

  return (
    <SimpleLayout
      title="My Professional Resume"
      intro="View or download my resume showcasing my experience as a cloud solutions architect, full-stack developer, and personal trainer."
    >
      <div className="mt-6">
        <a 
          href={pdfUrl} 
          download="Suleyman_Kiani_Resume.pdf"
          className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-100 mb-8 dark:bg-zinc-800/40 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
        >
          Download Resume
          <HiDownload className="ml-2 h-4 w-4" />
        </a>
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-zinc-600 dark:text-zinc-400">
              Loading your resume...
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center items-center py-4">
            <div className="text-red-500 dark:text-red-400">
              {error}
            </div>
          </div>
        )}
        
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-md bg-white dark:bg-zinc-800/90">
          <div className="h-[70vh] lg:h-[80vh]">
            <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
              <div className="h-full">
                <Viewer 
                  fileUrl={pdfUrl} 
                  defaultScale={1.1}
                />
              </div>
            </Worker>
          </div>
        </div>
      </div>
            {/* Applify AI Banner */}
    <div className="fixed bottom-4 right-4 z-50">
      <Link 
        href="/projects" 
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src="/ApplifyLogo.svg" 
            alt="Applify AI Logo" 
            width={24} 
            height={24}
            className="object-cover"
          />
        </div>
        <span className="text-xs font-medium pr-1">
          Built using Applify AI — <span className="underline group-hover:no-underline">My Latest Project</span>
        </span>
      </Link>
    </div>
    </SimpleLayout>
  );
}
