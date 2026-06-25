import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Trash2, Download, Plus, ChevronLeft, ChevronRight, X, PenTool, Type, Upload, Calendar, Check, FileSignature, CheckCircle2, LayoutGrid, MousePointer2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { Rnd } from 'react-rnd';
import SignatureCanvas from 'react-signature-canvas';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SavedSignature {
  id: string;
  dataUrl: string;
  type: 'draw' | 'type' | 'upload';
}

interface PlacedSignature {
  id: string;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export function SignPdfModule() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [pageViewport, setPageViewport] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfRef, setPdfRef] = useState<any>(null);
  const [workingPdfBytes, setWorkingPdfBytes] = useState<Uint8Array | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  // Signatures State
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
  const [suggestedFields, setSuggestedFields] = useState<{x: number, y: number, width: number, height: number, page: number}[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    if (!pageViewport || !containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width - 32; 
        const newScale = availableWidth / pageViewport.width;
        setScaleFactor(Math.min(newScale, 1.2)); // Allow slight upscale or just 1
      }
    });
    
    observer.observe(containerRef.current);
    
    const availableWidth = containerRef.current.clientWidth - 32;
    setScaleFactor(Math.min(availableWidth / pageViewport.width, 1.2));
    
    return () => observer.disconnect();
  }, [pageViewport]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [activeDropBox, setActiveDropBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [inkColor, setInkColor] = useState('#000000');
  
  // Draw State
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  // Type State
  const [typeText, setTypeText] = useState('');
  const [typeFont, setTypeFont] = useState<'Caveat' | 'Dancing Script' | 'Pacifico'>('Caveat');

  // Load signatures from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pdf_saved_signatures');
    if (saved) {
      try {
        setSavedSignatures(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveSignatureToStorage = (sigs: SavedSignature[]) => {
    setSavedSignatures(sigs);
    localStorage.setItem('pdf_saved_signatures', JSON.stringify(sigs));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPlacedSignatures([]);
      setCurrentPage(1);
      setIsOrganizing(false);
      setIsProcessing(true);
      
      try {
        const buffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        setWorkingPdfBytes(uint8Array);
        setCurrentFileName(selectedFile.name);
        
        const pdfjs = (window as any)['pdfjs-dist/build/pdf.mjs'] || pdfjsLib;
        const pdf = await pdfjs.getDocument({ data: uint8Array }).promise;
        setPdfRef(pdf);
        setNumPages(pdf.numPages);
        
        // Initialize page order [0, 1, ..., n-1]
        const initialOrder = Array.from({ length: pdf.numPages }, (_, i) => i);
        setPageOrder(initialOrder);
        
        renderPage(pdf, 1);
        generateThumbnails(pdf);
      } catch (e) {
        console.error(e);
        alert('Failed to load PDF file.');
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const generateThumbnails = async (pdf: any) => {
    const thumbs: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      }
    }
    setPageThumbnails(thumbs);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1
  });

  const renderPage = async (pdf: any, pageNum: number) => {
    if (!pdf) return;
    const page = await pdf.getPage(pageNum);
    const scale = 1.2;
    const viewport = page.getViewport({ scale });
    setPageViewport(viewport);

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      }
    }

    // Auto-detect signature fields based on text
    try {
      const textContent = await page.getTextContent();
      const suggestions: {x: number, y: number, width: number, height: number, page: number}[] = [];
      for (const item of textContent.items) {
        if ('str' in item) {
          const text = item.str.toLowerCase();
          if (text.includes('sign') || text.includes('signature') || text.includes('buyer') || text.includes('seller') || text.includes('date:')) {
            const tx = item.transform;
            const [vx, vy] = viewport.convertToViewportPoint(tx[4], tx[5]);
            // pdfjs text coordinate (vy) is baseline. We'll suggest a box right above/around this text.
            suggestions.push({
              x: vx,
              y: Math.max(0, vy - 60),
              width: 150,
              height: 50,
              page: pageNum
            });
          }
        }
      }
      setSuggestedFields(suggestions);
    } catch(e) {
      console.warn("Failed to detect text fields for signatures", e);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      renderPage(pdfRef, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      renderPage(pdfRef, newPage);
    }
  };

  // Create a signature from drawing
  const handleSaveDraw = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) return;
    
    // Custom trim to avoid react-signature-canvas getTrimmedCanvas error in Vite
    const canvas = sigCanvas.current.getCanvas();
    const ctx = canvas.getContext('2d');
    let dataUrl = canvas.toDataURL('image/png');
    
    if (ctx) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const l = pixels.data.length;
      let bound = { top: null as number | null, left: null as number | null, right: null as number | null, bottom: null as number | null };
      let x, y;
      for (let i = 0; i < l; i += 4) {
          if (pixels.data[i + 3] !== 0) {
              x = (i / 4) % canvas.width;
              y = ~~((i / 4) / canvas.width);
              if (bound.top === null) bound.top = y;
              if (bound.left === null || x < bound.left) bound.left = x;
              if (bound.right === null || x > bound.right) bound.right = x;
              if (bound.bottom === null || y > bound.bottom) bound.bottom = y;
          }
      }
      if (bound.top !== null && bound.left !== null && bound.right !== null && bound.bottom !== null) {
        const trimWidth = bound.right - bound.left + 1;
        const trimHeight = bound.bottom - bound.top + 1;
        const trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
        const copy = document.createElement('canvas');
        copy.width = trimWidth;
        copy.height = trimHeight;
        const copyCtx = copy.getContext('2d');
        if (copyCtx) {
          copyCtx.putImageData(trimmed, 0, 0);
          dataUrl = copy.toDataURL('image/png');
        }
      }
    }
    
    const newSig: SavedSignature = {
      id: Date.now().toString(),
      dataUrl,
      type: 'draw'
    };
    saveSignatureToStorage([...savedSignatures, newSig]);
    setIsModalOpen(false);
    sigCanvas.current.clear();
  };

  // Create a signature from typing
  const handleSaveType = () => {
    if (!typeText.trim()) return;
    
    // Render text to a temporary canvas to get a data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set a large enough canvas, we will trim it conceptually or just let it be big enough
    canvas.width = 800;
    canvas.height = 300;
    
    ctx.font = `100px "${typeFont}"`;
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    ctx.fillText(typeText, canvas.width / 2, canvas.height / 2);
    
    // In a real robust app, we'd trim the transparent pixels here.
    const dataUrl = canvas.toDataURL('image/png');
    
    const newSig: SavedSignature = {
      id: Date.now().toString(),
      dataUrl,
      type: 'type'
    };
    saveSignatureToStorage([...savedSignatures, newSig]);
    setIsModalOpen(false);
    setTypeText('');
  };

  // Upload an image
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const newSig: SavedSignature = {
          id: Date.now().toString(),
          dataUrl: ev.target.result as string,
          type: 'upload'
        };
        saveSignatureToStorage([...savedSignatures, newSig]);
        setIsModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteSavedSignature = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveSignatureToStorage(savedSignatures.filter(s => s.id !== id));
  };

  const addSignatureToPage = (dataUrl: string) => {
    if (!pageViewport) return;
    
    // Place in active drop box or center of page viewport
    const width = activeDropBox ? activeDropBox.width : 200;
    const height = activeDropBox ? (activeDropBox.width / 2) : 100; // maintain approx aspect ratio for sign
    const x = activeDropBox ? activeDropBox.x : (pageViewport.width / 2) - (width / 2);
    const y = activeDropBox ? activeDropBox.y - height + activeDropBox.height : (pageViewport.height / 2) - (height / 2);
    
    setPlacedSignatures([
      ...placedSignatures,
      {
        id: Date.now().toString() + Math.random().toString(),
        dataUrl,
        x,
        y,
        width,
        height,
        page: currentPage
      }
    ]);
    setActiveDropBox(null);
  };

  const addDateStamp = () => {
    if (!pageViewport) return;
    
    const dateStr = new Date().toLocaleDateString();
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 300;
    canvas.height = 80;
    
    ctx.font = '36px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    ctx.fillText(dateStr, canvas.width / 2, canvas.height / 2);
    const dataUrl = canvas.toDataURL('image/png');
    
    setPlacedSignatures([
      ...placedSignatures,
      {
        id: Date.now().toString() + Math.random().toString(),
        dataUrl,
        x: 50,
        y: 50,
        width: 150,
        height: 40,
        page: currentPage
      }
    ]);
  };

  const updatePlacedSignature = (id: string, updates: Partial<PlacedSignature>) => {
    setPlacedSignatures(placedSignatures.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removePlacedSignature = (id: string) => {
    setPlacedSignatures(placedSignatures.filter(s => s.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPageOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleExport = async () => {
    if (!workingPdfBytes) return;
    try {
      setIsProcessing(true);
      const pdfDoc = await PDFDocument.load(workingPdfBytes);
      
      // Create a map to cache images for signatures
      const imageCache: { [url: string]: any } = {};

      // Create a fresh document to reorder pages
      const newPdfDoc = await PDFDocument.create();
      
      for (const originalIndex of pageOrder) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [originalIndex]);
        const targetPage = newPdfDoc.addPage(copiedPage);

        // Get viewport for THIS specific original page to map coordinates correctly
        const pdfjsPage = await pdfRef.getPage(originalIndex + 1);
        const viewport = pdfjsPage.getViewport({ scale: 1.2 }); // Match the scale used in renderPage

        // Find signatures for this original page content
        const sigsForThisPage = placedSignatures.filter(s => s.page === originalIndex + 1);

        for (const sig of sigsForThisPage) {
          const { width: pdfWidth, height: pdfHeight } = targetPage.getSize();
          
          if (!imageCache[sig.dataUrl]) {
            const imageBytes = await fetch(sig.dataUrl).then(res => res.arrayBuffer());
            imageCache[sig.dataUrl] = await newPdfDoc.embedPng(imageBytes);
          }
          
          const image = imageCache[sig.dataUrl];
          
          const scaleX = pdfWidth / viewport.width;
          const scaleY = pdfHeight / viewport.height;
          
          const pdfX = sig.x * scaleX;
          const pdfY = pdfHeight - ((sig.y + sig.height) * scaleY);
          const pdfSigWidth = sig.width * scaleX;
          const pdfSigHeight = sig.height * scaleY;

          targetPage.drawImage(image, {
            x: pdfX,
            y: pdfY,
            width: pdfSigWidth,
            height: pdfSigHeight,
          });
        }
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed_${currentFileName}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to sign and export PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPageSignatures = placedSignatures.filter(s => s.page === currentPage);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Sign Studio</h2>
          <p className="text-neutral-500 mt-2">Add signatures and organize PDF pages.</p>
        </div>
        
        {pdfRef && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setFile(null);
                setPdfRef(null);
                setWorkingPdfBytes(null);
                setPlacedSignatures([]);
              }}
              className="text-neutral-500 hover:text-neutral-900 font-bold text-sm px-4"
            >
              Close Document
            </button>
            <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              <button
                onClick={() => setIsOrganizing(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isOrganizing ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <MousePointer2 className="w-4 h-4" />
                Sign
              </button>
              <button
                onClick={() => setIsOrganizing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isOrganizing ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Organize
              </button>
            </div>

            <button
              onClick={handleExport}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 whitespace-nowrap"
            >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>

      {!pdfRef ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div 
            {...getRootProps()} 
            className={`border-3 border-dashed rounded-3xl p-24 text-center cursor-pointer transition-all duration-300 outline-none ${
              isDragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-neutral-200 hover:border-indigo-400 hover:bg-indigo-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FileSignature className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">Click to upload a PDF</h3>
            <p className="text-neutral-500 text-sm">Or drag and drop the file here to start signing</p>
          </div>

          {isProcessing && (
            <div className="text-center py-20 flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
               <p className="text-indigo-600 font-bold animate-pulse">Loading document...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Left Sidebar: Tools & Saved Signatures */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-900 border-b pb-2">Signatures</h3>
              
              <div className="space-y-3">
                {savedSignatures.map(sig => (
                  <div 
                    key={sig.id}
                    onClick={() => addSignatureToPage(sig.dataUrl)}
                    className="relative group border border-neutral-200 rounded-lg p-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors bg-white flex items-center justify-center h-24"
                  >
                    <img src={sig.dataUrl} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="Saved Signature" />
                    <button 
                      onClick={(e) => deleteSavedSignature(sig.id, e)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity min-w-[24px] h-[24px] flex items-center justify-center cursor-pointer pointer-events-auto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setActiveDropBox(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Signature
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-900 border-b pb-2">Tools</h3>
              <button
                onClick={addDateStamp}
                className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors font-medium text-neutral-700 border border-neutral-200"
              >
                <Calendar className="w-5 h-5 text-neutral-500" />
                Add Date
              </button>
            </div>
          </div>

          {/* Main Stage: PDF Preview */}
          <div ref={containerRef} className="flex-1 bg-neutral-200/50 rounded-2xl border border-neutral-200 p-4 flex flex-col items-center justify-start overflow-auto min-h-[600px] relative">
            {!isOrganizing ? (
              <>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-200 mb-4 z-10 sticky top-0">
                  <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-medium text-sm">Page {currentPage} of {numPages}</span>
                  <button onClick={handleNextPage} disabled={currentPage === numPages} className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div 
                  style={{
                    width: pageViewport ? pageViewport.width * scaleFactor : 'auto',
                    height: pageViewport ? pageViewport.height * scaleFactor : 'auto',
                    transition: 'width 0.2s, height 0.2s'
                  }}
                  className="relative"
                >
                  <div 
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ 
                      transform: `scale(${scaleFactor})`,
                      width: pageViewport ? pageViewport.width : 'auto',
                      height: pageViewport ? pageViewport.height : 'auto'
                    }}
                  >
                    <div className="relative shadow-xl bg-white select-none w-full h-full">
                  <canvas ref={canvasRef} className="block" />
                  
                  {/* Suggested Fields Overlay */}
                  {suggestedFields.filter(f => f.page === currentPage).map((field, i) => (
                    <div 
                      key={`suggest-${i}`}
                      onClick={() => {
                        setActiveDropBox(field);
                        setIsModalOpen(true);
                      }}
                      className="absolute border-2 border-dashed border-indigo-400 bg-indigo-50/40 hover:bg-indigo-100/60 transition-colors cursor-pointer flex items-center justify-center animate-pulse shadow-sm"
                      style={{
                        left: field.x,
                        top: field.y,
                        width: field.width,
                        height: field.height,
                        zIndex: 5
                      }}
                    >
                      <span className="text-sm font-bold text-indigo-600 bg-white/80 px-2 flex items-center gap-1 py-1 rounded">
                        <FileSignature className="w-3 h-3" />
                        Sign Here
                      </span>
                    </div>
                  ))}

                  {/* Placed Signatures Overlay */}
                  {currentPageSignatures.map((sig) => (
                    <Rnd
                      key={sig.id}
                      scale={scaleFactor}
                      position={{ x: sig.x, y: sig.y }}
                      size={{ width: sig.width, height: sig.height }}
                      onDragStop={(e, d) => updatePlacedSignature(sig.id, { x: d.x, y: d.y })}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updatePlacedSignature(sig.id, {
                          width: parseInt(ref.style.width, 10),
                          height: parseInt(ref.style.height, 10),
                          ...position
                        });
                      }}
                      bounds="parent"
                      cancel=".cancel-drag"
                      className="group !absolute"
                      style={{ zIndex: 10 }}
                    >
                      <div className="w-full h-full relative group">
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 transition-colors rounded pointer-events-none" />
                        <img src={sig.dataUrl} className="w-full h-full object-contain mix-blend-multiply pointer-events-none" alt="Placed Signature" />
                        <button 
                          onMouseDown={(e) => { e.stopPropagation(); removePlacedSignature(sig.id); }}
                          onTouchStart={(e) => { e.stopPropagation(); removePlacedSignature(sig.id); }}
                          className="cancel-drag absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-50 cursor-pointer pointer-events-auto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </Rnd>
                  ))}
                </div>
                </div>
                </div>
              </>
            ) : (
              <div className="w-full max-w-4xl">
                <div className="mb-8 text-center">
                  <h3 className="text-lg font-bold text-neutral-900">Rearrange Pages</h3>
                  <p className="text-sm text-neutral-500">Drag and drop to reorder the pages of your document.</p>
                </div>
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={pageOrder}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {pageOrder.map((id) => (
                        <SortablePage key={id} id={id} thumbnail={pageThumbnails[id]} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signature Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-neutral-900">Create Signature</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex border-b border-neutral-100 flex-shrink-0">
              <button 
                onClick={() => setModalTab('draw')} 
                className={`flex-1 py-3 font-medium text-sm transition-colors border-b-2 ${modalTab === 'draw' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <PenTool className="w-4 h-4" /> Draw
                </div>
              </button>
              <button 
                onClick={() => setModalTab('type')} 
                className={`flex-1 py-3 font-medium text-sm transition-colors border-b-2 ${modalTab === 'type' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Type className="w-4 h-4" /> Type
                </div>
              </button>
              <button 
                onClick={() => setModalTab('upload')} 
                className={`flex-1 py-3 font-medium text-sm transition-colors border-b-2 ${modalTab === 'upload' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Upload
                </div>
              </button>
            </div>

            <div className="p-4 md:p-5 bg-neutral-50 flex-1 flex flex-col items-center justify-start overflow-y-auto">
              {modalTab === 'draw' && (
                <div className="w-full space-y-3">
                  <div className="bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden relative shadow-inner">
                    <SignatureCanvas 
                      ref={sigCanvas} 
                      canvasProps={{ className: 'w-full h-48 md:h-56 touch-none cursor-crosshair' }} 
                      backgroundColor="transparent"
                      penColor={inkColor}
                    />
                    <div className="absolute bottom-4 left-4 right-4 border-t-2 border-dashed border-neutral-200 pointer-events-none" />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-1 md:gap-2 p-1 bg-white border border-neutral-200 rounded-full shadow-sm">
                      {['#000000', '#2563EB', '#DC2626'].map(color => (
                        <button
                          key={color}
                          onClick={() => setInkColor(color)}
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-transform ${inkColor === color ? 'border-indigo-300 scale-110 shadow-sm' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <button onClick={() => sigCanvas.current?.clear()} className="text-neutral-500 hover:text-neutral-900 font-medium text-sm">Clear</button>
                      <button onClick={handleSaveDraw} className="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm text-sm">Save & Use</button>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'type' && (
                <div className="w-full space-y-4">
                  <input
                    type="text"
                    value={typeText}
                    onChange={(e) => setTypeText(e.target.value)}
                    placeholder="Type your name here..."
                    className="w-full p-3 md:p-4 border border-neutral-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    autoFocus
                  />
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Select Style</p>
                    <div className="grid grid-cols-1 gap-2">
                      {(['Caveat', 'Dancing Script', 'Pacifico'] as const).map(font => (
                        <div 
                          key={font} 
                          onClick={() => setTypeFont(font)}
                          className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${typeFont === font ? 'border-indigo-600 bg-indigo-50' : 'border-neutral-200 bg-white hover:border-indigo-200'}`}
                        >
                          <span style={{ fontFamily: font, color: inkColor }} className="text-2xl md:text-3xl">{typeText || 'Signature'}</span>
                          {typeFont === font && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-1 md:gap-2 p-1 bg-white border border-neutral-200 rounded-full shadow-sm">
                      {['#000000', '#2563EB', '#DC2626'].map(color => (
                        <button
                          key={color}
                          onClick={() => setInkColor(color)}
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-transform ${inkColor === color ? 'border-indigo-300 scale-110 shadow-sm' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={handleSaveType} 
                      disabled={!typeText.trim()}
                      className="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 text-sm"
                    >
                      Save & Use
                    </button>
                  </div>
                </div>
              )}

              {modalTab === 'upload' && (
                <div className="w-full">
                  <label className="border-2 border-dashed border-neutral-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                      <FileUp className="w-8 h-8 text-neutral-500" />
                    </div>
                    <p className="font-medium text-neutral-900">Click to upload image</p>
                    <p className="text-sm text-neutral-500 mt-1">PNG with transparent background recommended</p>
                    <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleSignatureUpload} />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SortablePage({ id, thumbnail }: { id: number; thumbnail: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`group relative bg-white rounded-xl shadow-md p-2 border-2 transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-transparent hover:border-indigo-300'}`}
    >
      <div className="aspect-[1/1.414] bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center relative">
        <img src={thumbnail} className="w-full h-full object-contain" alt={`Page ${id + 1}`} />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          DRAG TO MOVE
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs font-bold text-neutral-700">Page {id + 1}</span>
      </div>
    </div>
  );
}
