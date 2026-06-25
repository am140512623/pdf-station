# PDF Station

A fast, privacy-friendly toolkit for everyday PDF tasks. Most tools run entirely in your browser — your files never leave your machine. A small Node server powers document conversion (Word, Excel, and text into PDF).

## Features

- **Convert & Merge** — turn `.docx`, `.xlsx`/`.csv`, and text files into PDF and combine them into one.
- **Merge PDFs** — combine multiple PDFs into a single document, in any order.
- **Split / Extract** — pull out specific pages into a new PDF.
- **Organize Pages** — reorder, rotate, and delete pages in a visual grid.
- **Text & Watermarks** — stamp custom text or watermarks onto chosen pages.
- **Sign PDF** — draw or type a signature and place it anywhere.
- **Compress PDF** — shrink file size with lossless or lossy modes.
- **Smart Edit** — in-place text editing. _(Coming soon — in active development.)_

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server (Vite + Express via tsx):
   ```bash
   npm run dev
   ```
3. Open http://localhost:4100

> No API keys are required to run PDF Station.

## Build & deploy

Build the client bundle and the server:

```bash
npm run build   # vite build -> dist/, then bundles server.ts -> dist/server.cjs
npm start       # NODE_ENV=production node dist/server.cjs
```

In production the server serves the static `dist/` build and exposes the
`/api/convert-merge` endpoint. Configure the port with the `PORT` environment
variable (defaults to `4100`).

## Scripts

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Run the app in development with HMR.          |
| `npm run build` | Type-check-free production build (client + server). |
| `npm start`     | Serve the production build.                   |
| `npm run lint`  | Type-check the project with `tsc --noEmit`.   |
| `npm run clean` | Remove build artifacts.                       |
