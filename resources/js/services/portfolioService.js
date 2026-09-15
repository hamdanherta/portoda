import axios from 'axios';
import { uploadBase64ToStorage } from './storageService';

const processPortfolioImages = async (itemData) => {
  const processedData = { ...itemData };
  
  if (processedData.cover_image) {
    processedData.cover_image = await uploadBase64ToStorage(processedData.cover_image, 'portfolio', 'karya');
    processedData.image_url = processedData.cover_image;
  }

  if (processedData.gallery_images && Array.isArray(processedData.gallery_images)) {
    processedData.gallery_images = await Promise.all(
      processedData.gallery_images.map(img => uploadBase64ToStorage(img, 'portfolio', 'karya'))
    );
  }

  if (processedData.images && Array.isArray(processedData.images)) {
    processedData.images = await Promise.all(
      processedData.images.map(img => uploadBase64ToStorage(img, 'portfolio', 'karya'))
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

  async createItem(newItemData) {
    const processedData = await processPortfolioImages(newItemData);
    try {
      const response = await axios.post('/api/portfolio-items', processedData);
      return response.data;
    } catch (err) {
      console.error('Failed to create portfolio item:', err);
      throw err;
    }
  },

  async updateItem(id, updatedFields) {
    const processedData = await processPortfolioImages(updatedFields);
    try {
      const response = await axios.put(`/api/portfolio-items/${id}`, processedData);
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
