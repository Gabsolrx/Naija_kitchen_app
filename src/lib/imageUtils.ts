export async function compressImage(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Force downscale to prevent huge base64 strings
        const maxDim = 800; // Cap to 800px max
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(event.target?.result as string); // Fallback to original
          return;
        }

        // Fill white background just in case we convert a transparent PNG to JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output as webp if transparency needed, else jpeg for best compression
        let mimeType = 'image/jpeg';
        let quality = 0.7; // 70% quality keeps it tiny
        
        if (file.type === 'image/png' || file.type === 'image/webp') {
          // WebP preserves transparency and supports quality compression unlike PNG
          mimeType = 'image/webp';
          quality = 0.8;
        }
        
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        // Fallback to original if image loading fails
        resolve(event.target?.result as string);
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsDataURL(file);
  });
}
