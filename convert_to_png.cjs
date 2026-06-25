const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inDir  = path.join(__dirname, 'illustrations');
const outDir = path.join(__dirname, 'illustrations_png');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const files = fs.readdirSync(inDir).filter(f => f.endsWith('.svg'));

(async () => {
  for (const file of files) {
    const inPath  = path.join(inDir, file);
    const outFile = file.replace('.svg', '.png');
    const outPath = path.join(outDir, outFile);
    await sharp(Buffer.from(fs.readFileSync(inPath)))
      .png()
      .toFile(outPath);
    console.log(`Converted: ${outFile}`);
  }
  console.log(`\nDone! ${files.length} PNGs saved to: ${outDir}`);
})();
