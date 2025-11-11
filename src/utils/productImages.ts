/**
 * Utility to generate appropriate product images based on product name or category
 * Uses Unsplash Source API for high-quality product images
 */

// Map product categories to relevant search terms for images
const categoryImageMap: Record<string, string> = {
  'electronics': 'electronics',
  'clothing': 'fashion',
  'books': 'book',
  'food': 'food',
  'furniture': 'furniture',
  'sports': 'sports',
  'beauty': 'cosmetics',
  'toys': 'toys',
  'automotive': 'car',
  'health': 'health',
  'jewelry': 'jewelry',
  'home': 'home',
  'garden': 'garden',
  'music': 'music',
  'office': 'office',
};

// Map common product keywords to image search terms (simplified for Unsplash)
const keywordImageMap: Record<string, string> = {
  'phone': 'smartphone',
  'laptop': 'laptop',
  'shirt': 'shirt',
  'shoes': 'shoes',
  'watch': 'watch',
  'camera': 'camera',
  'headphones': 'headphones',
  'bag': 'bag',
  'book': 'book',
  'chair': 'chair',
  'table': 'table',
  'lamp': 'lamp',
  'plant': 'plant',
  'bottle': 'bottle',
  'cup': 'cup',
  'pen': 'pen',
  'notebook': 'notebook',
  'keyboard': 'keyboard',
  'mouse': 'mouse',
  'monitor': 'monitor',
  'speaker': 'speaker',
  'tv': 'television',
  'game': 'gaming',
  'toy': 'toy',
  'bike': 'bicycle',
  'car': 'car',
  'sunglasses': 'sunglasses',
  'perfume': 'perfume',
  'cream': 'cream',
  'makeup': 'makeup',
  'jewelry': 'jewelry',
  'ring': 'ring',
  'necklace': 'necklace',
  'earrings': 'earrings',
};

/**
 * Get image search term based on product name and category
 */
function getImageSearchTerm(productName: string, category?: string): string {
  const nameLower = productName.toLowerCase();
  
  // First, try to match category
  if (category) {
    const categoryLower = category.toLowerCase();
    for (const [key, value] of Object.entries(categoryImageMap)) {
      if (categoryLower.includes(key)) {
        return value;
      }
    }
  }
  
  // Then, try to match keywords in product name
  for (const [key, value] of Object.entries(keywordImageMap)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }
  
  // Extract main words from product name as fallback
  // Remove common words and get meaningful terms
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = productName.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 2); // Take first 2 meaningful words
  
  if (words.length > 0) {
    return words.join('-'); // Join words with hyphen for better search
  }
  
  // Default to generic product image
  return 'product';
}

/**
 * Generate an appropriate product image URL
 * Uses Unsplash Source API for real stock images based on product name
 */
export function getProductImage(
  productName: string,
  category?: string,
  existingImage?: string
): string {
  // If image already exists and is valid, use it
  if (existingImage && existingImage.trim() !== '' && existingImage !== '/placeholder.svg') {
    // Check if it's a valid URL
    try {
      new URL(existingImage);
      return existingImage;
    } catch {
      // If it's not a valid URL but not empty, return as is (might be a relative path)
      if (existingImage.startsWith('/') || existingImage.startsWith('./')) {
        return existingImage;
      }
    }
  }
  
  // Generate image based on product name and category
  const searchTerm = getImageSearchTerm(productName, category);
  
  // Use Unsplash Source API - free, no authentication needed
  // Provides real stock images based on search terms
  // Format: https://source.unsplash.com/{width}x{height}/?{search-term}
  const width = 800;
  const height = 800;
  
  // Clean search term for URL - Unsplash Source API format
  // Format: https://source.unsplash.com/{width}x{height}/?{search-term}
  const cleanSearchTerm = searchTerm.replace(/\s+/g, ',').toLowerCase();
  
  // Use Unsplash Source API with the search term
  // This will return real stock images related to the product from Unsplash
  // The images are fetched from Unsplash's vast collection based on the search term
  return `https://source.unsplash.com/${width}x${height}/?${cleanSearchTerm}`;
}

/**
 * Generate a photo ID based on product name (deterministic)
 */
function generatePhotoId(productName: string): string {
  // Use a hash of the product name to get consistent photo IDs
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    const char = productName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Map to a range of valid Unsplash photo IDs
  // Using some known good product photo IDs
  const photoIds = [
    '1461988622367-27b9373dfba7', // Electronics
    '1523275335684-4b9bde1d07d1', // Products
    '1441986300917-64604bdcd9c9', // Items
    '1558618666-fcd25c85cd64', // Products
    '1505740420928-5e560c06d30e', // Electronics
    '1572635196236-96722cb93e6a', // Fashion
    '1525966220024-b37fc686963b', // Shoes
    '1515889578218-bd3e94f113ef', // Fashion
    '1571781926291-c477ebfd0240', // Products
    '1505740420928-5e560c06d30e', // Electronics
  ];
  
  return photoIds[Math.abs(hash) % photoIds.length];
}

/**
 * Get multiple product images (for image gallery)
 */
export function getProductImages(
  productName: string,
  category?: string,
  existingImages?: string[]
): string[] {
  // If images already exist, use them
  if (existingImages && existingImages.length > 0) {
    const validImages = existingImages.filter(img => img && img.trim() !== '' && img !== '/placeholder.svg');
    if (validImages.length > 0) {
      return validImages;
    }
  }
  
  // Generate multiple images based on product name and category
  const searchTerm = getImageSearchTerm(productName, category);
  const cleanSearchTerm = searchTerm.replace(/\s+/g, ',').toLowerCase();
  const width = 800;
  const height = 800;
  
  // Generate 3 related images using Unsplash Source API
  // Each will be a different but related stock image from Unsplash
  return [
    `https://source.unsplash.com/${width}x${height}/?${cleanSearchTerm}`,
    `https://source.unsplash.com/${width}x${height}/?${cleanSearchTerm},product`,
    `https://source.unsplash.com/${width}x${height}/?${cleanSearchTerm},commercial`,
  ];
}

