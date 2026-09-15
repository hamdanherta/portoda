import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

const LANG_KEY = 'portoda_language_pref';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      return saved === 'en' ? 'en' : 'id';
    } catch (e) {
      return 'id';
    }
  });

  const setLang = (newLang) => {
    const validLang = newLang === 'en' ? 'en' : 'id';
    setLangState(validLang);
    try {
      localStorage.setItem(LANG_KEY, validLang);
    } catch (e) {
      console.error('Failed to save language preference', e);
    }
  };

  const toggleLang = () => {
    setLang(lang === 'id' ? 'en' : 'id');
  };

  const t = (key) => {
    const langDict = translations[lang] || translations.id;
    return langDict[key] || translations.id[key] || key;
  };

  // Helper to extract localized property from data items
  // e.g. item.title_en when lang === 'en', else item.title
  const getLocalizedField = (item, field) => {
    if (!item) return '';
    if (lang === 'en' && item[`${field}_en`]) {
      return item[`${field}_en`];
    }
    return item[field] || item[`${field}_id`] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, getLocalizedField }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
