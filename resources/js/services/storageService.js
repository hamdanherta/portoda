import axios from 'axios';

/**
 * Mengunggah file (File object atau string Base64) ke storage lokal Laravel.
 * @param {File|string} fileOrData - File object atau Data URL base64
 * @param {string} bucketName - Diabaikan (dipertahankan untuk kompatibilitas fungsi)
 * @param {string} folderPath - Subfolder unggahan (default: "images")
 * @param {Function|null} onProgress - Callback persentase progress unggah (0-100)
 * @returns {Promise<string>} URL publik berkas hasil unggahan (/storage/...).
 */
export const uploadFileToStorage = async (fileOrData, bucketName = 'portfolio', folderPath = 'images', onProgress = null) => {
  if (!fileOrData) {
    if (onProgress) onProgress(100);
    return fileOrData;
  }

  // Case A: Multipart FormData untuk File asli (e.g. PDF 30MB+, Gambar tanpa pembengkakan Base64)
  if (fileOrData instanceof File) {
    try {
      const formData = new FormData();
      formData.append('file', fileOrData);
      formData.append('folder', folderPath);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
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
      throw new Error('Server tidak mengembalikan URL berkas publik.');
    } catch (error) {
      console.error('Terjadi kesalahan saat mengunggah FormData ke Laravel:', error);
      throw error;
    }
  }

  // Case B: Handle Base64 Data URL string
  if (typeof fileOrData === 'string' && fileOrData.startsWith('data:')) {
    try {
      const response = await axios.post('/api/upload', {
        image: fileOrData,
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
      throw new Error('Server tidak mengembalikan URL berkas Base64.');
    } catch (error) {
      console.error('Terjadi kesalahan saat mengunggah data Base64 ke Laravel:', error);
      throw error;
    }
  }

  // Case C: Sudah berupa URL atau path publik
  if (onProgress) onProgress(100);
  return fileOrData;
};

// Backward compatibility alias
export const uploadBase64ToStorage = uploadFileToStorage;
