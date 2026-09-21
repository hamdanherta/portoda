import axios from 'axios';

/**
 * Mengunggah string Base64 atau file ke storage lokal Laravel.
 * @param {string} base64String - Data URL gambar (contoh: "data:image/webp;base64,...")
 * @param {string} bucketName - Diabaikan (dipertahankan untuk kompatibilitas fungsi)
 * @param {string} folderPath - Subfolder unggahan (default: "images")
 * @param {Function|null} onProgress - Callback persentase progress unggah (0-100)
 * @returns {Promise<string>} URL publik gambar hasil unggahan (/storage/...).
 */
export const uploadBase64ToStorage = async (base64String, bucketName = 'portfolio', folderPath = 'images', onProgress = null) => {
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:')) {
    if (onProgress) onProgress(100);
    return base64String;
  }

  try {
    const response = await axios.post('/api/upload', {
      image: base64String,
      folder: folderPath
    }, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(pct);
        }
      }
    });

    if (response.data && response.data.url) {
      if (onProgress) onProgress(100);
      return response.data.url;
    }

    if (onProgress) onProgress(100);
    return base64String;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengunggah gambar ke Laravel:', error);
    if (onProgress) onProgress(100);
    return base64String;
  }
};
