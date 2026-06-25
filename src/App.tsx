import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';
import { FileUp, GripVertical, Trash2, Download, Plus, FileText, SplitSquareHorizontal, Layers, LayoutGrid, RotateCw, ChevronLeft, ChevronRight, PenTool, Wand2, Zap, FileSignature, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { Rnd } from 'react-rnd';
import SignatureCanvas from 'react-signature-canvas';
import { SignPdfModule } from './components/SignPdfModule';
import { ConvertModule } from './components/ConvertModule';
import { LandingPage } from './components/LandingPage';

export type Tab = 'merge' | 'split' | 'edit' | 'annotate' | 'smart-edit' | 'compress' | 'sign' | 'convert';

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('convert');

  if (view === 'landing') {
    return <LandingPage onLaunch={(tab) => { setActiveTab(tab); setView('app'); }} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-neutral-200 p-6 flex flex-col">
        <button onClick={() => setView('landing')} className="flex items-center gap-2 mb-8 group self-start" title="Back to home">
          <Layers className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-blue-700 transition-colors">PDF Station</h1>
        </button>
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'convert' ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Zap className="w-5 h-5" />
            Convert & Merge
          </button>
          <button
            onClick={() => setActiveTab('merge')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'merge' ? 'bg-blue-50 text-blue-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Plus className="w-5 h-5" />
            Merge PDFs
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'split' ? 'bg-blue-50 text-blue-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <SplitSquareHorizontal className="w-5 h-5" />
            Split / Extract
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'edit' ? 'bg-purple-50 text-purple-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Organize pages
          </button>
          <button
            onClick={() => setActiveTab('annotate')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'annotate' ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <PenTool className="w-5 h-5" />
            Add Text & Watermarks
          </button>
          <button
            onClick={() => setActiveTab('smart-edit')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'smart-edit' ? 'bg-rose-50 text-rose-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Wand2 className="w-5 h-5" />
            Smart Edit
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">Soon</span>
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'sign' ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <FileSignature className="w-5 h-5" />
            Sign PDF
          </button>
          <button
            onClick={() => setActiveTab('compress')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap ${
              activeTab === 'compress' ? 'bg-cyan-50 text-cyan-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Zap className="w-5 h-5" />
            Compress PDF
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'merge' && <MergePdfModule />}
          {activeTab === 'split' && <SplitPdfModule />}
          {activeTab === 'edit' && <OrganizePdfModule />}
          {activeTab === 'annotate' && <AnnotatePdfModule />}
          {activeTab === 'smart-edit' && <ComingSoonModule />}
          {activeTab === 'sign' && <SignPdfModule />}
          {activeTab === 'compress' && <CompressPdfModule />}
          {activeTab === 'convert' && <ConvertModule />}
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Merge PDF Module
// ---------------------------------------------------------------------------
interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

function MergePdfModule() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimize, setOptimize] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  } as any);

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    const newFiles = [...files];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    try {
      setIsProcessing(true);
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: optimize });
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged_document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Failed to merge PDFs. Please check if the files are corrupted or password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Merge PDFs</h2>
        <p className="text-neutral-500 mt-2">Combine multiple PDF files into a single document. Drag and drop to reorder.</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 outline-none
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <FileUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-900">Drop PDF files here</p>
            <p className="text-sm text-neutral-500 mt-1">or click to browse from your computer</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
            <span className="font-medium text-sm text-neutral-600">{files.length} file{files.length !== 1 && 's'} selected</span>
            <button 
              onClick={() => setFiles([])}
              className="text-sm text-neutral-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
            {files.map((file, index) => (
              <li key={file.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors group">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                  </button>
                  <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
                  <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Remove file"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${optimize ? 'bg-blue-600' : 'bg-neutral-300'}`}>
                <input type="checkbox" checked={optimize} onChange={e => setOptimize(e.target.checked)} className="sr-only" />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${optimize ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">Compress Output</span>
            </label>
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm transition-all
                ${files.length < 2 || isProcessing
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                }
              `}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Processing...' : 'Merge & Download PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Split PDF Module
// ---------------------------------------------------------------------------
function SplitPdfModule() {
  const [file, setFile] = useState<File | null>(null);
  const [pageInput, setPageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);

  const loadPdfInfo = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPdfPageCount(pdf.getPageCount());
    } catch {
      setPdfPageCount(null);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setPageInput('');
      loadPdfInfo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  } as any);

  const handleSplit = async () => {
    if (!file || !pageInput.trim() || !pdfPageCount) return;
    
    try {
      setIsProcessing(true);
      
      const parsedPages = new Set<number>();
      const parts = pageInput.split(',').map(p => p.trim());
      
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
            for (let i = start; i <= end; i++) {
              if (i <= pdfPageCount) parsedPages.add(i - 1); // 0-indexed
            }
          }
        } else {
          const pb = parseInt(part, 10);
          if (!isNaN(pb) && pb > 0 && pb <= pdfPageCount) {
            parsedPages.add(pb - 1);
          }
        }
      }

      const indicesToExtract = Array.from(parsedPages).sort((a, b) => a - b);
      
      if (indicesToExtract.length === 0) {
        alert('Could not parse valid pages. Please check your format (e.g. "1, 3, 5-10").');
        setIsProcessing(false);
        return;
      }

      const originalBytes = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(originalBytes);
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(originalDoc, indicesToExtract);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error extracting pages:', error);
      alert('Failed to extract pages. Please ensure the PDF is not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Split / Extract Pages</h2>
        <p className="text-neutral-500 mt-2">Extract specific pages from a PDF to create a new document.</p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 outline-none
            ${isDragActive ? 'border-orange-500 bg-orange-50 scale-[1.02]' : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <FileUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">Drop a PDF file here</p>
              <p className="text-sm text-neutral-500 mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-orange-50/50">
             <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-neutral-900 truncate">{file.name}</p>
                <p className="text-sm text-neutral-500 flex items-center gap-2">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {pdfPageCount && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>{pdfPageCount} pages total</span>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPdfPageCount(null);
                  setPageInput('');
                }}
                className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Change file"
              >
                Change File
              </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label htmlFor="pages" className="block text-sm font-medium text-neutral-900 mb-2">
                Pages to Extract
              </label>
              <input
                id="pages"
                type="text"
                placeholder="e.g. 1, 3, 5-10"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-neutral-400"
              />
              <p className="text-sm text-neutral-500 mt-2">
                Enter comma-separated page numbers or ranges (e.g. <span className="font-mono bg-neutral-100 px-1 rounded text-neutral-700">1, 4, 8-12</span>). Minimum is 1.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSplit}
                disabled={!pageInput.trim() || isProcessing}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm transition-all
                  ${!pageInput.trim() || isProcessing
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md active:scale-95'
                  }
                `}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isProcessing ? 'Processing...' : 'Extract & Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Organize & Edit PDF Module
// ---------------------------------------------------------------------------
interface PageData {
  id: string;
  originalIndex: number;
  addedRotation: number;
}

function OrganizePdfModule() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimize, setOptimize] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setFile(f);
      try {
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const count = pdf.getPageCount();
        const initialPages = Array.from({ length: count }).map((_, i) => ({
          id: crypto.randomUUID(),
          originalIndex: i,
          addedRotation: 0,
        }));
        setPages(initialPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Could not load this PDF. It might be encrypted or corrupted.');
        setFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  } as any);

  const rotatePage = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, addedRotation: p.addedRotation + 90 } : p));
  };

  const deletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    if ((direction === 'left' && index === 0) || (direction === 'right' && index === pages.length - 1)) return;
    const newPages = [...pages];
    const swapIndex = direction === 'left' ? index - 1 : index + 1;
    [newPages[index], newPages[swapIndex]] = [newPages[swapIndex], newPages[index]];
    setPages(newPages);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    try {
      setIsProcessing(true);
      const originalBytes = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(originalBytes);
      const newDoc = await PDFDocument.create();

      for (const p of pages) {
        const [copiedPage] = await newDoc.copyPages(originalDoc, [p.originalIndex]);
        const existingAngle = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees(existingAngle + p.addedRotation));
        newDoc.addPage(copiedPage);
      }

      const pdfBytes = await newDoc.save({ useObjectStreams: optimize });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to save edited PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Organize & Edit</h2>
        <p className="text-neutral-500 mt-2">Reorder, rotate, or remove pages from your PDF file.</p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 outline-none
            ${isDragActive ? 'border-purple-500 bg-purple-50 scale-[1.02]' : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <FileUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">Drop a PDF file here</p>
              <p className="text-sm text-neutral-500 mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-purple-50/50">
             <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-neutral-900 truncate">{file.name}</p>
                <p className="text-sm text-neutral-500">{pages.length} pages remaining</p>
              </div>
              <button
                onClick={() => { setFile(null); setPages([]); }}
                className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Change File"
              >
                Change File
              </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[500px]">
            {pages.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">All pages removed.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {pages.map((p, index) => (
                  <div key={p.id} className="relative group bg-white border border-neutral-200 rounded-xl p-3 flex flex-col items-center gap-3 transition-all hover:border-purple-300 hover:shadow-md">
                    <div className="w-full aspect-[1/1.4] bg-neutral-50 border border-neutral-200 shadow-inner rounded flex items-center justify-center relative overflow-hidden">
                      <div 
                        className="text-neutral-300 transition-transform duration-300"
                        style={{ transform: `rotate(${p.addedRotation}deg)` }}
                      >
                        <FileText className="w-12 h-12" />
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                        {p.originalIndex + 1}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 w-full flex-wrap">
                      <button onClick={() => movePage(index, 'left')} disabled={index === 0} className="p-2 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 rounded-lg hover:bg-neutral-100 transition-colors" title="Move Left">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => rotatePage(p.id)} className="p-2 text-neutral-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Rotate 90°">
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePage(p.id)} className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete Page">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => movePage(index, 'right')} disabled={index === pages.length - 1} className="p-2 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 rounded-lg hover:bg-neutral-100 transition-colors" title="Move Right">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${optimize ? 'bg-purple-600' : 'bg-neutral-300'}`}>
                <input type="checkbox" checked={optimize} onChange={e => setOptimize(e.target.checked)} className="sr-only" />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${optimize ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">Compress Output</span>
            </label>
            <button
              onClick={handleSave}
              disabled={pages.length === 0 || isProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm transition-all
                ${pages.length === 0 || isProcessing
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md active:scale-95'
                }
              `}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Saving...' : 'Save & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Annotate & Add Text PDF Module
// ---------------------------------------------------------------------------
interface Annotation {
  id: string;
  text: string;
  pageRange: string;
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  size: number;
  color: string;
}

function AnnotatePdfModule() {
  const [file, setFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newAnn, setNewAnn] = useState<Omit<Annotation, 'id'>>({
    text: '',
    pageRange: 'all',
    position: 'center',
    size: 24,
    color: '#000000',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);

  const loadPdfInfo = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPdfPageCount(pdf.getPageCount());
    } catch {
      setPdfPageCount(null);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnnotations([]);
      loadPdfInfo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  } as any);

  const addAnnotation = () => {
    if (!newAnn.text.trim()) return;
    setAnnotations([...annotations, { ...newAnn, id: crypto.randomUUID() }]);
    setNewAnn({ ...newAnn, text: '' });
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  const handleSave = async () => {
    if (!file || annotations.length === 0) return;
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const pageCount = pages.length;

      for (const ann of annotations) {
        const targetPages = new Set<number>();
        if (ann.pageRange.toLowerCase() === 'all') {
          pages.forEach((_, i) => targetPages.add(i));
        } else {
          const parts = ann.pageRange.split(',').map(p => p.trim());
          for (const part of parts) {
            if (part.includes('-')) {
              const [start, end] = part.split('-').map(Number);
              if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                  if (i > 0 && i <= pageCount) targetPages.add(i - 1);
                }
              }
            } else {
              const pNum = Number(part);
              if (!isNaN(pNum) && pNum > 0 && pNum <= pageCount) {
                targetPages.add(pNum - 1);
              }
            }
          }
        }

        const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ann.color);
        const r = colorParts ? parseInt(colorParts[1], 16) / 255 : 0;
        const g = colorParts ? parseInt(colorParts[2], 16) / 255 : 0;
        const b = colorParts ? parseInt(colorParts[3], 16) / 255 : 0;
        const textColor = rgb(r, g, b);

        const textWidth = helveticaFont.widthOfTextAtSize(ann.text, ann.size);
        const textHeight = helveticaFont.heightAtSize(ann.size);

        for (const pageIndex of targetPages) {
          const page = pages[pageIndex];
          const { width, height } = page.getSize();
          
          const margin = 50;
          let x = margin;
          let y = height - margin - textHeight;

          switch (ann.position) {
            case 'top-center': x = (width - textWidth) / 2; break;
            case 'top-right': x = width - margin - textWidth; break;
            case 'center-left': y = (height - textHeight) / 2; break;
            case 'center': x = (width - textWidth) / 2; y = (height - textHeight) / 2; break;
            case 'center-right': x = width - margin - textWidth; y = (height - textHeight) / 2; break;
            case 'bottom-left': y = margin; break;
            case 'bottom-center': x = (width - textWidth) / 2; y = margin; break;
            case 'bottom-right': x = width - margin - textWidth; y = margin; break;
          }

          page.drawText(ann.text, {
            x,
            y,
            size: ann.size,
            font: helveticaFont,
            color: textColor,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error annotating PDF:', error);
      alert('Failed to save annotated PDF. Ensure it is not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Add Text & Watermarks</h2>
        <p className="text-neutral-500 mt-2">Add custom text or watermarks to specific pages of your PDF.</p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 outline-none
            ${isDragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <PenTool className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">Drop a PDF file here</p>
              <p className="text-sm text-neutral-500 mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-emerald-50/50">
             <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-neutral-900 truncate">{file.name}</p>
                <p className="text-sm text-neutral-500 flex items-center gap-2">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {pdfPageCount && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>{pdfPageCount} pages total</span>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setPdfPageCount(null); setAnnotations([]); }}
                className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Change File"
              >
                Change File
              </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-4 max-w-2xl bg-neutral-50 p-6 rounded-xl border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4">Add new text layer</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-900 mb-1">Text content</label>
                  <input
                    type="text"
                    value={newAnn.text}
                    onChange={(e) => setNewAnn({ ...newAnn, text: e.target.value })}
                    placeholder="e.g. DRAFT or Confidential..."
                    className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">Target Pages</label>
                  <input
                    type="text"
                    value={newAnn.pageRange}
                    onChange={(e) => setNewAnn({ ...newAnn, pageRange: e.target.value })}
                    placeholder="e.g. all, 1, 2-5"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">Position</label>
                  <select
                    value={newAnn.position}
                    onChange={(e) => setNewAnn({ ...newAnn, position: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="center-left">Center Left</option>
                    <option value="center">Center</option>
                    <option value="center-right">Center Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={newAnn.size}
                    onChange={(e) => setNewAnn({ ...newAnn, size: Number(e.target.value) })}
                    min="8" max="200"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={newAnn.color}
                      onChange={(e) => setNewAnn({ ...newAnn, color: e.target.value })}
                      className="w-10 h-10 p-0.5 bg-white rounded cursor-pointer border border-neutral-300"
                    />
                    <span className="text-sm font-mono text-neutral-500">{newAnn.color.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={addAnnotation}
                  disabled={!newAnn.text.trim()}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Add to Queue
                </button>
              </div>
            </div>

            {annotations.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4">Pending Additions</h3>
                <ul className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  {annotations.map((ann) => (
                    <li key={ann.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-8 h-8 rounded-full border border-neutral-200"
                          style={{ backgroundColor: ann.color }}
                        />
                        <div>
                          <p className="font-medium text-neutral-900">"{ann.text}"</p>
                          <p className="text-xs text-neutral-500">Pages: {ann.pageRange} &bull; {ann.position} &bull; Size {ann.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAnnotation(ann.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end">
            <button
              onClick={handleSave}
              disabled={annotations.length === 0 || isProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm transition-all
                ${annotations.length === 0 || isProcessing
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:scale-95'
                }
              `}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Processing layer...' : 'Apply & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Coming Soon placeholder (used for Smart Edit while it's being finished)
// ---------------------------------------------------------------------------
function ComingSoonModule() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Smart Edit</h2>
        <p className="text-neutral-500 mt-2">In-place text editing for your PDFs.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <Wand2 className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-md">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            Coming Soon
          </span>
          <h3 className="text-xl font-semibold text-neutral-900">We're putting the finishing touches on this</h3>
          <p className="text-neutral-500">
            Smart Edit lets you detect and rewrite text directly inside a PDF. It needs a bit more work
            before it's ready, so it's temporarily unavailable. In the meantime, try
            <span className="font-medium text-neutral-700"> Add Text &amp; Watermarks</span> or
            <span className="font-medium text-neutral-700"> Organize pages</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Smart Edit PDF Module (Text Replacement)
// ---------------------------------------------------------------------------

// Initialize worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface DetectedText {
  id: string;
  originalText: string;
  currentText: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  colorHex: string;
  originalColorHex: string;
}

function SmartEditPdfModule() {
  const [file, setFile] = useState<File | null>(null);
  const [textBlocks, setTextBlocks] = useState<DetectedText[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const extractTextFromPage = async (pdfBytes: ArrayBuffer, pageNum: number) => {
    try {
      setIsProcessing(true);
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
      
      const page = await pdf.getPage(pageNum);
      
      // Render to canvas to sample colors
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('No 2d context');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;

      const textContent = await page.getTextContent();
      const blocks: DetectedText[] = [];
      
      for (const item of textContent.items) {
        if ('str' in item && item.str.trim().length > 0) {
          const tx = item.transform;
          const fontSize = Math.abs(tx[3]);
          
          // PDF 'y' is the baseline. We convert it to viewport coordinates.
          const [cx, cy] = viewport.convertToViewportPoint(tx[4], tx[5]);
          const scale = 1.5;
          const scaledWidth = item.width * scale;
          const scaledHeight = fontSize * scale;
          
          // Sample the bounding box to find the text color (darkest non-transparent pixel)
          // `cy` is the baseline in canvas coords. Text goes from `cy - scaledHeight` to `cy`.
          const sampleX = Math.max(0, Math.floor(cx));
          const sampleY = Math.max(0, Math.floor(cy - scaledHeight * 0.8));
          const sampleW = Math.max(1, Math.floor(scaledWidth));
          const sampleH = Math.max(1, Math.floor(scaledHeight));
          
          let colorHex = '#000000';
          try {
            const imgData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
            const data = imgData.data;
            let r = 0, g = 0, b = 0;
            let minBrightness = 255;
            
            for(let i=0; i<data.length; i+=4) {
              if (data[i+3] > 128) { // If pixel is visible
                const br = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                if (br < minBrightness) {
                  minBrightness = br;
                  r = data[i]; g = data[i+1]; b = data[i+2];
                }
              }
            }
            if (minBrightness < 250) { // If it's not basically white
              colorHex = '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
            }
          } catch (err) {
            // Context might throw if out of bounds, fallback to black
          }

          blocks.push({
            id: crypto.randomUUID(),
            originalText: item.str,
            currentText: item.str,
            x: tx[4],
            y: tx[5],
            width: item.width,
            height: fontSize,
            fontName: item.fontName,
            colorHex,
            originalColorHex: colorHex
          });
        }
      }
      
      setTextBlocks(blocks);
    } catch (e) {
      console.error('Extraction failed', e);
      alert('Failed to analyze text from this PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setFile(f);
      const buffer = await f.arrayBuffer();
      extractTextFromPage(buffer, 1);
      setPageNumber(1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  } as any);

  const loadDifferentPage = async (newPage: number) => {
    if (!file || newPage < 1 || newPage > totalPages) return;
    setPageNumber(newPage);
    const buffer = await file.arrayBuffer();
    extractTextFromPage(buffer, newPage);
  };

  const handleUpdateText = (id: string, newText: string) => {
    setTextBlocks(blocks => blocks.map(b => b.id === id ? { ...b, currentText: newText } : b));
  };

  const handleUpdateColor = (id: string, newColorHex: string) => {
    setTextBlocks(blocks => blocks.map(b => b.id === id ? { ...b, colorHex: newColorHex } : b));
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const page = pdfDoc.getPages()[pageNumber - 1]; // 0-indexed in pdf-lib
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const block of textBlocks) {
        if (block.currentText !== block.originalText || block.colorHex !== block.originalColorHex) {
          // 1. Draw white rectangle over the original text
          // We pad it slightly to ensure the old descenders/ascenders are hidden
          const paddingX = 2;
          const descentY = block.height * 0.25; 
          page.drawRectangle({
            x: block.x - paddingX,
            y: block.y - descentY,
            width: block.width + (paddingX * 2),
            height: block.height * 1.3,
            color: rgb(1, 1, 1), // White
          });

          // Extract color components
          const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(block.colorHex);
          const r = colorParts ? parseInt(colorParts[1], 16) / 255 : 0;
          const g = colorParts ? parseInt(colorParts[2], 16) / 255 : 0;
          const b = colorParts ? parseInt(colorParts[3], 16) / 255 : 0;

          // 2. Draw new text. Let's try to match font size, but it might overflow if longer
          page.drawText(block.currentText, {
            x: block.x,
            y: block.y,
            size: block.height,
            font: helveticaFont,
            color: rgb(r, g, b),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart_edited_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to save edited PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Smart Edit (Beta)</h2>
        <p className="text-neutral-500 mt-2">Detects text blocks and lets you rewrite them in-place. We rebuild that section with standard fonts.</p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 outline-none
            ${isDragActive ? 'border-rose-500 bg-rose-50 scale-[1.02]' : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
              <Wand2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">Drop a PDF file here</p>
              <p className="text-sm text-neutral-500 mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-rose-50/50">
             <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-neutral-900 truncate">{file.name}</p>
                <div className="text-sm text-neutral-500 flex items-center gap-2 mt-1">
                  <span>Page {pageNumber} of {totalPages}</span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1 ml-2">
                       <button onClick={() => loadDifferentPage(pageNumber - 1)} disabled={pageNumber <= 1} className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"><ChevronLeft className="w-4 h-4"/></button>
                       <button onClick={() => loadDifferentPage(pageNumber + 1)} disabled={pageNumber >= totalPages} className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"><ChevronRight className="w-4 h-4"/></button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setTextBlocks([]); }}
                className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Change File"
              >
                Change File
              </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b pb-2">Detected Text Blocks</h3>
            
            {isProcessing ? (
               <div className="py-12 flex flex-col items-center justify-center text-neutral-500">
                  <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-4" />
                  <p>Analyzing PDF text contents...</p>
               </div>
            ) : textBlocks.length === 0 ? (
               <div className="py-12 text-center text-neutral-500">
                  <p>No editable text blocks found on this page.</p>
                  <p className="text-sm">This is common for scanned documents or images.</p>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
                  {textBlocks.map(block => {
                     const isEdited = block.currentText !== block.originalText || block.colorHex !== block.originalColorHex;
                     return (
                        <div key={block.id} className={`p-4 rounded-xl border transition-all ${isEdited ? 'border-rose-500 bg-rose-50/30 shadow-sm' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'}`}>
                           <p className="text-xs font-mono text-neutral-400 mb-2 truncate" title={block.originalText}>Original: {block.originalText}</p>
                           <textarea 
                              value={block.currentText}
                              onChange={(e) => handleUpdateText(block.id, e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                              rows={2}
                           />
                           <div className="flex items-center justify-between mt-2">
                             <div className="flex items-center gap-2">
                               <input 
                                 type="color" 
                                 value={block.colorHex}
                                 onChange={(e) => handleUpdateColor(block.id, e.target.value)}
                                 className="w-6 h-6 p-0 border-0 rounded cursor-pointer mix-blend-multiply"
                               />
                               <span className="text-xs text-neutral-500">Color</span>
                             </div>
                             {isEdited && (
                                <button onClick={() => {
                                  handleUpdateText(block.id, block.originalText);
                                  handleUpdateColor(block.id, block.originalColorHex);
                                }} className="text-xs font-medium text-rose-600 hover:text-rose-700">Revert</button>
                             )}
                           </div>
                        </div>
                     );
                  })}
                </div>
            )}
           </div>

          <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isProcessing || !textBlocks.some(b => b.currentText !== b.originalText || b.colorHex !== b.originalColorHex)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm transition-all
                ${isProcessing || !textBlocks.some(b => b.currentText !== b.originalText || b.colorHex !== b.originalColorHex)
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md active:scale-95'
                }
              `}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isProcessing ? 'Saving...' : 'Apply Edits & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compress PDF Module
// ---------------------------------------------------------------------------

function CompressPdfModule() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [mode, setMode] = useState<'lossless' | 'high' | 'medium' | 'low'>('medium');
  const [estimatedSizes, setEstimatedSizes] = useState<Record<string, number>>({});
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    if (!file) {
      setEstimatedSizes({});
      return;
    }
    let isCancelled = false;
    
    const estimate = async () => {
      setIsEstimating(true);
      try {
        const buffer = await file.arrayBuffer();
        const originalLength = buffer.byteLength;
        const result: Record<string, number> = {};

        // Lossless estimate
        const pdfDoc = await PDFDocument.load(buffer.slice(0));
        const newPdfDoc = await PDFDocument.create();
        const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((p) => newPdfDoc.addPage(p));
        const losslessBytes = await newPdfDoc.save({ useObjectStreams: true });
        if (!isCancelled) result.lossless = losslessBytes.byteLength;

        // For lossy, test page 1
        const pdfjs = (window as any)['pdfjs-dist/build/pdf.mjs'] || pdfjsLib;
        const pdfApp = await pdfjs.getDocument({ data: buffer.slice(0) }).promise;
        const numPages = pdfApp.numPages;
        const page1 = await pdfApp.getPage(1);

        const runEstimate = async (scale: number, quality: number) => {
          const viewport = page1.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return originalLength;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page1.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          // length of base64 approx: string_length * 0.75
          const pageBytes = Math.round(dataUrl.length * 0.75);
          const est = Math.round((pageBytes * numPages) + (numPages * 500));
          return est > originalLength ? originalLength : est; // fallback simulation
        };

        if (!isCancelled) result.high = await runEstimate(2.0, 0.7);
        if (!isCancelled) result.medium = await runEstimate(1.5, 0.6);
        if (!isCancelled) result.low = await runEstimate(1.0, 0.4);

        if (!isCancelled) {
          setEstimatedSizes(result);
        }
      } catch (e) {
        console.error("Estimate failed", e);
      } finally {
        if (!isCancelled) setIsEstimating(false);
      }
    };
    
    estimate();
    return () => { isCancelled = true; };
  }, [file]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setOriginalSize(acceptedFiles[0].size);
      setNewSize(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  } as any);

  const handleCompress = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const buffer = await file.arrayBuffer();
      const originalByteLength = buffer.byteLength;
      
      let finalBytes: Uint8Array | ArrayBuffer;

      if (mode === 'lossless') {
        const pdfDoc = await PDFDocument.load(buffer.slice(0));
        const newPdfDoc = await PDFDocument.create();
        const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((p) => newPdfDoc.addPage(p));
        finalBytes = await newPdfDoc.save({ useObjectStreams: true });
      } else {
        // Lossy compression using jsPDF and pdfjs
        const pdfjs = (window as any)['pdfjs-dist/build/pdf.mjs'] || pdfjsLib;
        const pdfApp = await pdfjs.getDocument({ data: buffer.slice(0) }).promise;
        const numPages = pdfApp.numPages;
        
        // Get first page to set initial document size
        const firstPage = await pdfApp.getPage(1);
        const firstVp = firstPage.getViewport({ scale: 1.0 });
        const doc = new jsPDF({
          orientation: firstVp.width > firstVp.height ? 'landscape' : 'portrait',
          unit: 'pt',
          format: [firstVp.width, firstVp.height]
        });

        for (let i = 1; i <= numPages; i++) {
          const page = await pdfApp.getPage(i);
          
          let scale = 1.5;
          let quality = 0.6;
          
          if (mode === 'high') {
            scale = 2.0;
            quality = 0.7;
          } else if (mode === 'medium') {
            scale = 1.5;
            quality = 0.6;
          } else if (mode === 'low') {
            scale = 1.0;
            quality = 0.4;
          }

          const viewport = page.getViewport({ scale });
          const originalViewport = page.getViewport({ scale: 1.0 });
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('No 2d context');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imgData = canvas.toDataURL('image/jpeg', quality); 
          
          if (i > 1) {
            doc.addPage([originalViewport.width, originalViewport.height], originalViewport.width > originalViewport.height ? 'landscape' : 'portrait');
            doc.setPage(i);
          }
          
          doc.addImage(imgData, 'JPEG', 0, 0, originalViewport.width, originalViewport.height);
        }
        
        finalBytes = doc.output('arraybuffer');
      }

      // Auto fallback: if rasterizing bloated the file, fallback to the original buffer
      if (finalBytes.byteLength >= originalByteLength) {
         // Attempt a simple lossless optimization first to see if it reduces size
         const pdfDoc = await PDFDocument.load(buffer.slice(0));
         const optimizedBytes = await pdfDoc.save({ useObjectStreams: true });
         if (optimizedBytes.byteLength < originalByteLength) {
           finalBytes = optimizedBytes;
         } else {
           finalBytes = buffer; // Fallback to original
         }
      }

      setNewSize(finalBytes.byteLength);
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Compress PDF</h2>
        <p className="text-neutral-500 mt-2">Optimize and reduce the file size of your PDF documents using stream compression.</p>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 outline-none
            ${isDragActive ? 'border-cyan-500 bg-cyan-50 scale-[1.02]' : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">Drop your PDF here</p>
              <p className="text-sm text-neutral-500 mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-cyan-50/50">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-neutral-900 truncate">{file.name}</p>
              <p className="text-sm text-neutral-500 mt-1">{formatSize(originalSize)}</p>
            </div>
            <button
              onClick={() => { setFile(null); setNewSize(0); }}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {newSize > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-emerald-800 font-semibold text-lg">Compression Complete!</p>
                  <p className="text-emerald-600 text-sm">
                    {newSize < originalSize ? `Reduced from ${formatSize(originalSize)} to ${formatSize(newSize)}` : `Kept original size of ${formatSize(originalSize)} to prevent file bloat.`}
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 font-bold">
                  {newSize < originalSize ? `-${Math.max(0, Math.round((1 - newSize / originalSize) * 100))}% smaller` : 'No reduction'}
                </div>
              </div>
            )}

            <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${mode === 'lossless' ? 'border-cyan-500 bg-cyan-50' : 'border-neutral-200 bg-white hover:border-cyan-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="compressionMode" value="lossless" checked={mode === 'lossless'} onChange={() => setMode('lossless')} className="w-4 h-4 text-cyan-600 focus:ring-cyan-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">Lossless (No Blur)</p>
                    <p className="text-sm text-neutral-500">Only prunes unused objects. Maximum quality, but minimal size reduction.</p>
                  </div>
                  {isEstimating ? (
                    <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  ) : estimatedSizes.lossless ? (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-cyan-700">~{formatSize(estimatedSizes.lossless)}</p>
                      <p className="text-xs text-neutral-500">
                        {Math.round((1 - estimatedSizes.lossless / (file?.size || 1)) * 100) > 0 
                          ? `-${Math.round((1 - estimatedSizes.lossless / (file?.size || 1)) * 100)}% smaller` 
                          : 'No reduction'}
                      </p>
                    </div>
                  ) : null}
                </div>
              </label>

              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${mode === 'high' ? 'border-cyan-500 bg-cyan-50' : 'border-neutral-200 bg-white hover:border-cyan-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="compressionMode" value="high" checked={mode === 'high'} onChange={() => setMode('high')} className="w-4 h-4 text-cyan-600 focus:ring-cyan-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">High Quality (Less Blur)</p>
                    <p className="text-sm text-neutral-500">Converts to high-res images. Good size reduction, keeps text readable.</p>
                  </div>
                  {isEstimating ? (
                    <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  ) : estimatedSizes.high ? (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-cyan-700">~{formatSize(estimatedSizes.high)}</p>
                      <p className="text-xs text-neutral-500">
                        {Math.round((1 - estimatedSizes.high / (file?.size || 1)) * 100) > 0 
                          ? `-${Math.round((1 - estimatedSizes.high / (file?.size || 1)) * 100)}% smaller` 
                          : 'No reduction'}
                      </p>
                    </div>
                  ) : null}
                </div>
              </label>

              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${mode === 'medium' ? 'border-cyan-500 bg-cyan-50' : 'border-neutral-200 bg-white hover:border-cyan-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="compressionMode" value="medium" checked={mode === 'medium'} onChange={() => setMode('medium')} className="w-4 h-4 text-cyan-600 focus:ring-cyan-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">Medium Compression</p>
                    <p className="text-sm text-neutral-500">Balanced approach. Moderate file size reduction, some loss in sharpness.</p>
                  </div>
                  {isEstimating ? (
                    <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  ) : estimatedSizes.medium ? (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-cyan-700">~{formatSize(estimatedSizes.medium)}</p>
                      <p className="text-xs text-neutral-500">
                        {Math.round((1 - estimatedSizes.medium / (file?.size || 1)) * 100) > 0 
                          ? `-${Math.round((1 - estimatedSizes.medium / (file?.size || 1)) * 100)}% smaller` 
                          : 'No reduction'}
                      </p>
                    </div>
                  ) : null}
                </div>
              </label>

              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${mode === 'low' ? 'border-cyan-500 bg-cyan-50' : 'border-neutral-200 bg-white hover:border-cyan-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="compressionMode" value="low" checked={mode === 'low'} onChange={() => setMode('low')} className="w-4 h-4 text-cyan-600 focus:ring-cyan-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">Aggressive Compression</p>
                    <p className="text-sm text-neutral-500">Maximum compression. Great for scanned documents, but text will be blurry.</p>
                  </div>
                  {isEstimating ? (
                    <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  ) : estimatedSizes.low ? (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-cyan-700">~{formatSize(estimatedSizes.low)}</p>
                      <p className="text-xs text-neutral-500">
                        {Math.round((1 - estimatedSizes.low / (file?.size || 1)) * 100) > 0 
                          ? `-${Math.round((1 - estimatedSizes.low / (file?.size || 1)) * 100)}% smaller` 
                          : 'No reduction'}
                      </p>
                    </div>
                  ) : null}
                </div>
              </label>
            </div>

            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-3 bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  Compress & Download
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

