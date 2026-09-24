import axios from 'axios';
import { uploadBase64ToStorage } from './storageService';

const processPortfolioImages = async (itemData, onProgress = null) => {
  const processedData = { ...itemData };
  
  if (processedData.cover_image) {
    processedData.cover_image = await uploadBase64ToStorage(processedData.cover_image, 'portfolio', 'karya', (p) => {
      if (onProgress) onProgress(Math.round(p * 0.4));
    });
    processedData.image_url = processedData.cover_image;
  }

  if (processedData.gallery_images && Array.isArray(processedData.gallery_images)) {
    const total = processedData.gallery_images.length;
    processedData.gallery_images = await Promise.all(
      processedData.gallery_images.map((img, idx) =>
        uploadBase64ToStorage(img, 'portfolio', 'karya', (p) => {
          if (onProgress) {
            const basePct = 40 + (idx / total) * 40;
            const stepPct = (p / 100) * (40 / total);
            onProgress(Math.round(basePct + stepPct));
          }
        })
      )
    );
  }

  if (processedData.images && Array.isArray(processedData.images)) {
    const total = processedData.images.length;
    processedData.images = await Promise.all(
      processedData.images.map((img, idx) =>
        uploadBase64ToStorage(img, 'portfolio', 'karya', (p) => {
          if (onProgress) {
            const basePct = 40 + (idx / total) * 40;
            const stepPct = (p / 100) * (40 / total);
            onProgress(Math.round(basePct + stepPct));
          }
        })
      )
    );
  }
  
  return processedData;
};

export const portfolioService = {
  async getItems({ category = 'all', subcategory = 'all', searchQuery = '' } = {}) {
    try {
      const response = await axios.get('/api/portfolio-items', {
        params: { category, subcategory, searchQuery }
      });
      return response.data || [];
    } catch (err) {
      console.error('Failed to fetch portfolio items from Laravel API:', err);
      return [];
    }
  },

  async createItem(newItemData, onProgress = null) {
    if (onProgress) onProgress(10);
    const processedData = await processPortfolioImages(newItemData, (p) => {
      if (onProgress) onProgress(10 + Math.round(p * 0.7)); // 10% to 80%
    });
    try {
      const response = await axios.post('/api/portfolio-items', processedData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 80 + Math.round((progressEvent.loaded * 20) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (onProgress) onProgress(100);
      return response.data;
    } catch (err) {
      console.error('Failed to create portfolio item:', err);
      throw err;
    }
  },

  async updateItem(id, updatedFields, onProgress = null) {
    if (onProgress) onProgress(10);
    const processedData = await processPortfolioImages(updatedFields, (p) => {
      if (onProgress) onProgress(10 + Math.round(p * 0.7)); // 10% to 80%
    });
    try {
      const response = await axios.put(`/api/portfolio-items/${id}`, processedData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 80 + Math.round((progressEvent.loaded * 20) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (onProgress) onProgress(100);
      return response.data;
    } catch (err) {
      console.error('Failed to update portfolio item:', err);
      throw err;
    }
  },

  async deleteItem(id) {
    try {
      await axios.delete(`/api/portfolio-items/${id}`);
      return true;
    } catch (err) {
      console.error('Failed to delete portfolio item:', err);
      throw err;
    }
  },

  async reorderItems(items) {
    try {
      const itemsPayload = items.map(item => typeof item === 'object' ? item.id : item);
      const response = await axios.post('/api/portfolio-items/reorder', { items: itemsPayload });
      return response.data || [];
    } catch (err) {
      console.error('Failed to reorder portfolio items:', err);
      throw err;
    }
  },

  async resetToMockData() {
    try {
      const response = await axios.post('/api/portfolio-items/reset');
      return response.data;
    } catch (err) {
      console.error('Failed to reset portfolio items:', err);
      throw err;
    }
  }
};
