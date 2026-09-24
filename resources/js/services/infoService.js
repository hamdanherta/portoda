import axios from 'axios';
import { uploadBase64ToStorage, uploadFileToStorage } from './storageService';

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

  async saveExperience(expData, onProgress = null) {
    if (onProgress) onProgress(10);
    const payload = { ...expData };
    if (payload.media && Array.isArray(payload.media)) {
      const total = payload.media.length;
      payload.media = await Promise.all(
        payload.media.map((img, idx) =>
          uploadBase64ToStorage(img, 'portfolio', 'pengalaman', (p) => {
            if (onProgress) {
              const basePct = 10 + (idx / total) * 70;
              const stepPct = (p / 100) * (70 / total);
              onProgress(Math.round(basePct + stepPct));
            }
          })
        )
      );
    }
    
    try {
      const response = await axios.post('/api/experiences', payload, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 80 + Math.round((progressEvent.loaded * 20) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      if (onProgress) onProgress(100);
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

  async reorderExperiences(items) {
    try {
      const response = await axios.post('/api/experiences/reorder', { items });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to reorder experiences:', err);
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

  async saveDocument(docData, onProgress = null) {
    if (onProgress) onProgress(5);
    const payload = { ...docData };

    const targetFile = payload.rawFile || payload.fileUrl;
    if (targetFile) {
      payload.file_url = await uploadFileToStorage(targetFile, 'portfolio', 'documents', (p) => {
        if (onProgress) onProgress(5 + Math.round(p * 0.85)); // 5% - 90%
      });
    }

    delete payload.rawFile;
    delete payload.fileUrl;

    try {
      const response = await axios.post('/api/documents', payload, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 90 + Math.round((progressEvent.loaded * 10) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      if (onProgress) onProgress(100);
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

  async reorderDocuments(items) {
    try {
      const response = await axios.post('/api/documents/reorder', { items });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to reorder documents:', err);
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

  async saveContact(contactData, onProgress = null) {
    if (onProgress) onProgress(20);
    try {
      const response = await axios.post('/api/contacts', contactData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 20 + Math.round((progressEvent.loaded * 80) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      if (onProgress) onProgress(100);
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

  async reorderContacts(items) {
    try {
      const response = await axios.post('/api/contacts/reorder', { items });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to reorder contacts:', err);
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

  async saveCertificate(certData, onProgress = null) {
    if (onProgress) onProgress(10);
    const payload = { ...certData };
    if (payload.cover) {
      payload.cover = await uploadBase64ToStorage(payload.cover, 'portfolio', 'sertifikat', (p) => {
        if (onProgress) onProgress(10 + Math.round(p * 0.35));
      });
    }
    if (payload.gallery && Array.isArray(payload.gallery)) {
      const total = payload.gallery.length;
      payload.gallery = await Promise.all(
        payload.gallery.map((img, idx) =>
          uploadBase64ToStorage(img, 'portfolio', 'sertifikat', (p) => {
            if (onProgress) {
              const basePct = 45 + (idx / total) * 35;
              const stepPct = (p / 100) * (35 / total);
              onProgress(Math.round(basePct + stepPct));
            }
          })
        )
      );
    }

    try {
      const response = await axios.post('/api/certificates', payload, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 80 + Math.round((progressEvent.loaded * 20) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      if (onProgress) onProgress(100);
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

  async reorderCertificates(items) {
    try {
      const response = await axios.post('/api/certificates/reorder', { items });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to reorder certificates:', err);
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
        
        const isMaint = data.maintenance_mode === true || data.maintenance_mode === 1 || data.maintenance_mode === '1';
        localStorage.setItem('portoda_maintenance_mode', isMaint ? 'true' : 'false');

        const isNotice = data.content_notice_enabled !== false && data.content_notice_enabled !== 0 && data.content_notice_enabled !== '0';
        localStorage.setItem('portoda_content_notice_enabled', isNotice ? 'true' : 'false');
      }
      return data;
    } catch (err) {
      console.error('Failed to get profile:', err);
      return {};
    }
  },

  async saveProfile(profileData, onProgress = null) {
    if (onProgress) onProgress(10);
    const payload = { ...profileData };
    if (payload.avatar) {
      payload.avatar = await uploadBase64ToStorage(payload.avatar, 'portfolio', 'profil', (p) => {
        if (onProgress) onProgress(10 + Math.round(p * 0.35));
      });
    }
    if (payload.brand_logo) {
      payload.brand_logo = await uploadBase64ToStorage(payload.brand_logo, 'portfolio', 'profil', (p) => {
        if (onProgress) onProgress(45 + Math.round(p * 0.35));
      });
    }

    try {
      const response = await axios.post('/api/profile', payload, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 80 + Math.round((progressEvent.loaded * 20) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (typeof window !== 'undefined') {
        const isEnabled = response.data?.watermark_enabled !== false && response.data?.watermark_enabled !== 0 && response.data?.watermark_enabled !== '0';
        localStorage.setItem('portoda_watermark_enabled', isEnabled ? 'true' : 'false');
        
        const isMaint = response.data?.maintenance_mode === true || response.data?.maintenance_mode === 1 || response.data?.maintenance_mode === '1';
        localStorage.setItem('portoda_maintenance_mode', isMaint ? 'true' : 'false');

        const isNotice = response.data?.content_notice_enabled !== false && response.data?.content_notice_enabled !== 0 && response.data?.content_notice_enabled !== '0';
        localStorage.setItem('portoda_content_notice_enabled', isNotice ? 'true' : 'false');

        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      if (onProgress) onProgress(100);
      return response.data;
    } catch (err) {
      console.error('Failed to save profile:', err);
      throw err;
    }
  },

  // --- CLIENTS ---
  async getClients() {
    try {
      const response = await axios.get('/api/clients');
      return response.data || [];
    } catch (err) {
      console.error('Failed to get clients:', err);
      return [];
    }
  },

  async saveClient(clientData, onProgress = null) {
    if (onProgress) onProgress(10);
    const payload = { ...clientData };
    if (payload.logo) {
      payload.logo = await uploadBase64ToStorage(payload.logo, 'portfolio', 'klien', (p) => {
        if (onProgress) onProgress(10 + Math.round(p * 0.7));
      });
    }

    try {
      const response = await axios.post('/api/clients', payload, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = 80 + Math.round((progressEvent.loaded * 20) / progressEvent.total);
            onProgress(pct);
          }
        }
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      if (onProgress) onProgress(100);
      return response.data;
    } catch (err) {
      console.error('Failed to save client:', err);
      throw err;
    }
  },

  async deleteClient(id) {
    try {
      const response = await axios.delete(`/api/clients/${id}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to delete client:', err);
      throw err;
    }
  },

  async reorderClients(items) {
    try {
      const response = await axios.post('/api/clients/reorder', { items });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('portoda_info_updated'));
      }
      return response.data;
    } catch (err) {
      console.error('Failed to reorder clients:', err);
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
