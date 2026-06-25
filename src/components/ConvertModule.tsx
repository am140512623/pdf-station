import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Trash2, Download, Plus, FileText, LayoutGrid, CheckCircle2, FileSignature, Wand2, X } from 'lucide-react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { renderAsync } from 'docx-preview';

interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  pdfBytes?: Uint8Array;
}

export function ConvertModule() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMergeAndDownload = async () => {
    if (files.length === 0) return;
    try {
      setIsProcessing(true);
      
      const formData = new FormData();
      files.forEach(item => {
        formData.append('files', item.file);
      });

      const response = await fetch('/api/convert-merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server-side conversion and merging failed.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged_document_${new Date().getTime()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      setFiles(prev => prev.map(f => ({ ...f, status: 'completed' })));
    } catch (e) {
      console.error(e);
      alert('Failed to merge and convert. Please check if the server is running correctly.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setFiles(prev => prev.map(f => ({ ...f, status: 'pending' })));
      }, 3000);
    }
  };

  const downloadIndividual = async (item: FileItem) => {
    try {
      setIsProcessing(true);
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing' } : f));
      
      const formData = new FormData();
      formData.append('files', item.file);

      const response = await fetch('/api/convert-merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server-side conversion failed.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const originalName = item.file.name.replace(/\.[^/.]+$/, "");
      a.download = `${originalName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'completed' } : f));
    } catch (e) {
      console.error(e);
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f));
      alert('Failed to convert file.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'pending' } : f));
      }, 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Convert & Merge</h2>
          <p className="text-neutral-500 mt-2">Convert Word, Excel, CSV, or Text files to PDF and merge them.</p>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-3 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-neutral-200 hover:border-indigo-400 hover:bg-indigo-50/50 outline-none'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <FileUp className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Upload files to convert</h3>
        <p className="text-neutral-500">Drag & drop your documents here, or click to select</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest">
           <span>.docx</span>
           <span>.xlsx</span>
           <span>.csv</span>
           <span>.txt</span>
           <span>.pdf</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 flex-wrap gap-4">
            <h3 className="font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Upload Queue ({files.length})
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMergeAndDownload}
                disabled={isProcessing || files.length < 2}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LayoutGrid className="w-4 h-4" />
                )}
                Merge & Download as One PDF
              </button>
              <button 
                onClick={() => setFiles([])}
                className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-100">
            {files.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    item.status === 'processing' ? 'bg-indigo-100 text-indigo-600 animate-pulse' :
                    item.status === 'completed' ? 'bg-green-100 text-green-600' :
                    item.status === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-neutral-100 text-neutral-500 group-hover:bg-white'
                  }`}>
                    {item.status === 'processing' ? <Wand2 className="w-5 h-5 animate-spin" /> : 
                     item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                     item.status === 'error' ? <X className="w-5 h-5" /> :
                     <FileUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 flex items-center gap-2">
                      {item.file.name}
                      {item.status === 'processing' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full animate-pulse">Converting...</span>}
                      {item.status === 'error' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Error</span>}
                    </p>
                    <p className="text-xs text-neutral-500">{(item.file.size / 1024).toFixed(1)} KB • {item.file.name.split('.').pop()?.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => downloadIndividual(item)}
                    disabled={isProcessing}
                    className="text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Convert
                  </button>
                  <button 
                    onClick={() => removeFile(item.id)}
                    disabled={isProcessing}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {files.length === 0 && !isProcessing && (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
          <p className="text-neutral-400 font-medium italic">Your conversion queue is empty. Drop files to get started.</p>
        </div>
      )}
    </div>
  );
}
