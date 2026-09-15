import axios from 'axios';

/**
 * Mengunggah string Base64 atau file ke storage lokal Laravel.
 * @param {string} base64String - Data URL gambar (contoh: "data:image/webp;base64,...")
 * @param {string} bucketName - Diabaikan (dipertahankan untuk kompatibilitas fungsi)
 * @param {string} folderPath - Subfolder unggahan (default: "images")
 * @returns {Promise<string>} URL publik gambar hasil unggahan (/storage/...).
 */
export const uploadBase64ToStorage = async (base64String, bucketName = 'portfolio', folderPath = 'images') => {
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:')) {
    return base64String;
  }

  try {
    const response = await axios.post('/api/upload', {
      image: base64String,
      folder: folderPath
    });

    if (response.data && response.data.url) {
      return response.data.url;
    }

    return base64String;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengunggah gambar ke Laravel:', error);
    return base64String;
  }
};
