const fs = require('fs');
const path = require('path');

// Files to process
const filesToProcess = [
  'src/app/order-success/page.js',
  'src/services/clearCart.js',
  'src/app/order/page.js',
  'src/app/order-details/[orderId]/page.js',
  'src/app/orders/page.js',
  'src/app/admin-view/order-details/[orderId]/page.js',
  'src/app/admin-view/all-orders/page.js',
  'src/app/checkout/CheckoutContent.js',
  'src/services/stripe.js',
  'src/services/address.js',
  'src/utils/fetchWithAuth.js',
  'src/app/account/page.js',
  'src/components/Navbar/index.js',
  'src/app/aipage/page.js',
  'src/app/page.js',
  'src/app/products/kids/page.js',
  'src/app/products/women/page.js',
  'src/app/products/men/page.js',
  'src/components/CommonListingClient/index.js',
  'src/components/InteractiveStyleSection.js',
  'src/services/updateProduct.js',
  'src/services/register.js',
  'src/services/getProducts.js',
  'src/services/getProductDetails.js',
  'src/services/getClientProducts.js',
  'src/services/deleteProduct.js',
  'src/services/deleteCartItem.js',
  'src/services/addToCart.js',
  'src/services/addProduct.js',
  'src/database/index.js',
  'src/app/products/[details]/page.js',
  'src/app/cart/page.js',
  'src/app/admin-view/page.js',
  'src/app/admin-view/all-products/page.js',
];

// Files to skip (critical for debugging)
const filesToSkip = [
  'src/middleware/AuthUser.js', // JWT error logging
  'src/middleware/CorsMiddleware.js', // CORS error logging
];

function removeConsoleLogs(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Remove console.log statements (but keep console.error for error handling)
    content = content.replace(/console\.log\([^)]*\);?\s*/g, '');
    content = content.replace(/console\.warn\([^)]*\);?\s*/g, '');
    content = content.replace(/console\.info\([^)]*\);?\s*/g, '');
    
    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Cleaned ${filePath}`);
      return true;
    } else {
      console.log(`- No changes needed for ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

console.log('Removing console.log statements from production code...\n');

let filesModified = 0;
filesToProcess.forEach(file => {
  if (removeConsoleLogs(file)) {
    filesModified++;
  }
});

console.log(`\n✅ Complete! Modified ${filesModified} files.`);
console.log(`\nNote: console.error statements were preserved for error handling.`);
console.log(`Critical middleware files were skipped to maintain debugging capabilities.`);