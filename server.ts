import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { createServer as createViteServer } from 'vite';
import htmlToPdfmake from 'html-to-pdfmake';
import { JSDOM } from 'jsdom';
// pdfmake 0.3.x no longer exposes the server printer from its main entry;
// the constructor lives at pdfmake/js/Printer.js as a `.default` export.
import PdfPrinterModule from 'pdfmake/js/Printer.js';

const fonts = {
  Roboto: {
    normal: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf'),
    bold: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf'),
    italics: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf')
  }
};

const PdfPrinter: any = (PdfPrinterModule as any).default ?? PdfPrinterModule;
const printer = new PdfPrinter(fonts);

const app = express();
const port = Number(process.env.PORT) || 4100;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// API: Convert and Merge
app.post('/api/convert-merge', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      let pdfBytes: Uint8Array;

      if (file.mimetype === 'application/pdf') {
        pdfBytes = new Uint8Array(file.buffer);
      } else {
        if (file.originalname.endsWith('.docx')) {
          // 1. Transform document to preserve alignment
          // @ts-ignore
          const transform = (mammoth as any).transforms.paragraph((paragraph: any) => {
            if (paragraph.alignment === 'center') {
              paragraph.styleId = 'Center';
              paragraph.styleName = 'Center';
            } else if (paragraph.alignment === 'right') {
              paragraph.styleId = 'Right';
              paragraph.styleName = 'Right';
            }
            return paragraph;
          });

          // 2. Convert to HTML
          const options = {
            transformDocument: transform,
            styleMap: [
              "p[style-name='Center'] => p.center",
              "p[style-name='Right'] => p.right",
              "p[style-name='Heading 1'] => h1",
              "p[style-name='Heading 2'] => h2",
            ]
          };
          
          const result = await mammoth.convertToHtml({ buffer: file.buffer }, options);
          const html = result.value;
          
          // 3. Convert HTML to pdfmake definition
          const { window } = new JSDOM("");
          const content = htmlToPdfmake(html, { 
            window,
            defaultStyles: {
              p: { margin: [0, 5, 0, 10] }
            }
          });

          const docDefinition = {
            content: content,
            pageSize: 'A4',
            pageMargins: [60, 60, 60, 60],
            styles: {
              center: { alignment: 'center' },
              right: { alignment: 'right' },
              'html-h1': { fontSize: 24, bold: true, margin: [0, 10, 0, 15] },
              'html-h2': { fontSize: 20, bold: true, margin: [0, 10, 0, 12] },
              'html-strong': { bold: true },
              'html-em': { italics: true },
              'html-table': { margin: [0, 5, 0, 15] },
              'html-td': { margin: [3, 3, 3, 3] },
              'html-th': { bold: true, margin: [3, 3, 3, 3], fillColor: '#f3f4f6' }
            },
            defaultStyle: {
              font: 'Roboto',
              fontSize: 11,
              lineHeight: 1.2
            }
          };

          // 4. Generate PDF using pdfmake
          const pdfDoc = printer.createPdfKitDocument(docDefinition as any);
          
          const chunks: any[] = [];
          pdfDoc.on('data', (chunk) => chunks.push(chunk));
          await new Promise<void>((resolve) => {
            pdfDoc.on('end', () => resolve());
            pdfDoc.end();
          });
          
          pdfBytes = Buffer.concat(chunks);
        } else if (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls') || file.originalname.endsWith('.csv')) {
          const workbook = XLSX.read(file.buffer);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const html = XLSX.utils.sheet_to_html(sheet);
          
          const { window } = new JSDOM("");
          const content = htmlToPdfmake(html, { window });
          const docDefinition = {
            content: content,
            pageSize: 'A4',
            pageOrientation: 'landscape'
          };
          
          const pdfDoc = printer.createPdfKitDocument(docDefinition as any);
          const chunks: any[] = [];
          pdfDoc.on('data', (chunk) => chunks.push(chunk));
          await new Promise<void>((resolve) => {
            pdfDoc.on('end', () => resolve());
            pdfDoc.end();
          });
          pdfBytes = Buffer.concat(chunks);
        } else {
          // Plain text
          const text = file.buffer.toString('utf-8');
          const docDefinition = {
            content: { text, preserveLeadingSpaces: true, font: 'Roboto' }
          };
          const pdfDoc = printer.createPdfKitDocument(docDefinition as any);
          const chunks: any[] = [];
          pdfDoc.on('data', (chunk) => chunks.push(chunk));
          await new Promise<void>((resolve) => {
            pdfDoc.on('end', () => resolve());
            pdfDoc.end();
          });
          pdfBytes = Buffer.concat(chunks);
        }
      }

      const doc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((p) => mergedPdf.addPage(p));
    }

    const finalBytes = await mergedPdf.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(finalBytes));
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Serve index.html for non-API routes in dev
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
