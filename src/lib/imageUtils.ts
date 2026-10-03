/**
 * Utility for resizing and compressing images in-browser before storing in IndexedDB
 */
export async function processImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ dataUrl: string; width: number; height: number; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('صيغة الصورة غير مدعومة'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
            fileName: file.name,
          });
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
          fileName: file.name,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Downloads a data URL as a file on client
 */
export function downloadImage(dataUrl: string, filename = 'alsharia-photo.jpg') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Formats Gregorian date to Arabic localized string
 */
export function formatArabicDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}
