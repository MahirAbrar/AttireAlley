const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY = 85;

async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const stats = fs.statSync(inputPath);
  const sizeInMB = stats.size / (1024 * 1024);
  
  if (sizeInMB < 0.1) {
    console.log(`Skipping ${inputPath} (already small: ${sizeInMB.toFixed(2)}MB)`);
    return;
  }

  try {
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      const newStats = fs.statSync(outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      const newSizeInMB = newStats.size / (1024 * 1024);
      const reduction = ((sizeInMB - newSizeInMB) / sizeInMB * 100).toFixed(1);
      
      console.log(`✓ Optimized ${path.basename(inputPath)}: ${sizeInMB.toFixed(2)}MB → ${newSizeInMB.toFixed(2)}MB (${reduction}% reduction)`);
    }
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      await optimizeImage(filePath, filePath);
    }
  }
}

console.log('Starting image optimization...\n');

// Process all PNG and JPG images in public directory
async function optimizeAllImages() {
  try {
    // Get all PNG files
    const pngFiles = [];
    const jpgFiles = [];
    
    function findImages(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.')) {
          findImages(filePath);
        } else if (file.endsWith('.png')) {
          pngFiles.push(filePath);
        } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
          jpgFiles.push(filePath);
        }
      });
    }
    
    findImages(PUBLIC_DIR);
    
    console.log(`Found ${pngFiles.length} PNG files and ${jpgFiles.length} JPG files to optimize\n`);
    
    // Process all images
    for (const file of [...pngFiles, ...jpgFiles]) {
      await optimizeImage(file, file);
    }
    
    console.log('\nImage optimization complete!');
  } catch (error) {
    console.error('Error during optimization:', error);
  }
}

optimizeAllImages();