import axios from 'axios';
import { uploadBase64ToStorage } from './storageService';

export const infoService = {
  // --- EXPERIENCES ---
  async getExperiences() {
    try {
      const response = await axios.get('/api/experiences');
      return response.data || [];
    } catch (err) {
      console.error('Failed to get experiences:', err);
      return [];
    }
  },

  async saveExperience(expData) {
    const payload = { ...expData };
    if (payload.media && Array.isArray(payload.media)) {
      payload.media = await Promise.all(
        payload.media.map(img => uploadBase64ToStorage(img, 'portfolio', 'pengalaman'))
      );
    }
    
    try {
      const response = await axios.post('/api/experiences', payload);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to save experience:', err);
      throw err;
    }
  },

  async deleteExperience(id) {
    try {
      const response = await axios.delete(`/api/experiences/${id}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to delete experience:', err);
      throw err;
    }
  },

  // --- DOCUMENTS ---
  async getDocuments() {
    try {
      const response = await axios.get('/api/documents');
      return response.data || [];
    } catch (err) {
      console.error('Failed to get documents:', err);
      return [];
    }
  },

  async saveDocument(docData) {
    const payload = { ...docData };
    if (payload.fileUrl) {
      payload.file_url = await uploadBase64ToStorage(payload.fileUrl, 'portfolio', 'documents');
    }

    try {
      const response = await axios.post('/api/documents', payload);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to save document:', err);
      throw err;
    }
  },

  async deleteDocument(id) {
    try {
      const response = await axios.delete(`/api/documents/${id}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to delete document:', err);
      throw err;
    }
  },

  // --- CONTACTS ---
  async getContacts() {
    try {
      const response = await axios.get('/api/contacts');
      return response.data || [];
    } catch (err) {
      console.error('Failed to get contacts:', err);
      return [];
    }
  },

  async saveContact(contactData) {
    try {
      const response = await axios.post('/api/contacts', contactData);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to save contact:', err);
      throw err;
    }
  },

  async deleteContact(id) {
    try {
      const response = await axios.delete(`/api/contacts/${id}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to delete contact:', err);
      throw err;
    }
  },

  // --- CERTIFICATES ---
  async getCertificates() {
    try {
      const response = await axios.get('/api/certificates');
      return response.data || [];
    } catch (err) {
      console.error('Failed to get certificates:', err);
      return [];
    }
  },

  async saveCertificate(certData) {
    const payload = { ...certData };
    if (payload.cover) {
      payload.cover = await uploadBase64ToStorage(payload.cover, 'portfolio', 'sertifikat');
    }
    if (payload.gallery && Array.isArray(payload.gallery)) {
      payload.gallery = await Promise.all(
        payload.gallery.map(img => uploadBase64ToStorage(img, 'portfolio', 'sertifikat'))
      );
    }

    try {
      const response = await axios.post('/api/certificates', payload);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to save certificate:', err);
      throw err;
    }
  },

  async deleteCertificate(id) {
    try {
      const response = await axios.delete(`/api/certificates/${id}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to delete certificate:', err);
      throw err;
    }
  },

  // --- PROFILE ---
  async getProfile() {
    try {
      const response = await axios.get('/api/profile');
      const data = response.data || {};
      if (typeof window !== 'undefined') {
        const isEnabled = data.watermark_enabled !== false && data.watermark_enabled !== 0 && data.watermark_enabled !== '0';
        localStorage.setItem('portoda_watermark_enabled', isEnabled ? 'true' : 'false');
      }
      return data;
    } catch (err) {
      console.error('Failed to get profile:', err);
      return {};
    }
  },

  async saveProfile(profileData) {
    try {
      const response = await axios.post('/api/profile', profileData);
      if (typeof window !== 'undefined') {
        const isEnabled = response.data?.watermark_enabled !== false && response.data?.watermark_enabled !== 0 && response.data?.watermark_enabled !== '0';
        localStorage.setItem('portoda_watermark_enabled', isEnabled ? 'true' : 'false');
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to save profile:', err);
      throw err;
    }
  },

  // Reset all info data to initial defaults in MySQL
  async resetAllInfo() {
    try {
      await axios.post('/api/info/reset');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return true;
    } catch (err) {
      console.error('Failed to reset all info:', err);
      throw err;
    }
  }
};
