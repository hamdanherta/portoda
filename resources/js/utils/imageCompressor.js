/**
 * Helper utility untuk membaca file gambar (JPG, PNG, WEBP, dll),
 * mengubah ukurannya secara proporsional (max width 1200px),
 * dan mengompres ke format WebP Data URL dengan kualitas optimal.
 */
export const compressImageToWebP = (file, quality = 0.82, maxWidth = 1200) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan berkas gambar valid'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize proporsional jika lebih besar dari maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Clean canvas background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        // Export ke WebP Data URL
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          resolve(webpDataUrl);
        } catch (e) {
          // Fallback jika browser tidak mendukung export webp canvas
          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegDataUrl);
        }
      };

      img.onerror = (err) => reject(new Error('Gagal memuat gambar untuk dikompres'));
    };

    reader.onerror = (err) => reject(err);
  });
};
