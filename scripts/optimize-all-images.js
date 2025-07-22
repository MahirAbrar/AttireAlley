const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..');
const QUALITY = 85;

async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const stats = fs.statSync(inputPath);
  const sizeInMB = stats.size / (1024 * 1024);
  
  if (sizeInMB < 0.05) { // Skip very small images
    console.log(`Skipping ${inputPath} (too small: ${sizeInMB.toFixed(2)}MB)`);
    return;
  }

  try {
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const outputWebP = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      
      // Skip if WebP already exists
      if (fs.existsSync(outputWebP)) {
        console.log(`Skipping ${path.basename(inputPath)} (WebP already exists)`);
        return;
      }
      
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputWebP);
      
      const newStats = fs.statSync(outputWebP);
      const newSizeInMB = newStats.size / (1024 * 1024);
      const reduction = ((sizeInMB - newSizeInMB) / sizeInMB * 100).toFixed(1);
      
      console.log(`✓ Optimized ${path.basename(inputPath)}: ${sizeInMB.toFixed(2)}MB → ${newSizeInMB.toFixed(2)}MB (${reduction}% reduction)`);
    }
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir, processedCount = { count: 0 }) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      await processDirectory(filePath, processedCount);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      await optimizeImage(filePath, filePath);
      processedCount.count++;
    }
  }
  
  return processedCount.count;
}

console.log('Starting comprehensive image optimization...\n');

// Process Pictures folder
const picturesDir = path.join(PROJECT_DIR, 'Pictures');
if (fs.existsSync(picturesDir)) {
  console.log('Processing Pictures folder...');
  processDirectory(picturesDir).then(count => {
    console.log(`\n✅ Optimization complete! Processed ${count} images.`);
    
    // Show total space saved
    const webpFiles = [];
    function findWebP(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          findWebP(filePath);
        } else if (file.endsWith('.webp')) {
          webpFiles.push(filePath);
        }
      });
    }
    
    findWebP(PROJECT_DIR);
    console.log(`\nTotal WebP files created: ${webpFiles.length}`);
  });
}