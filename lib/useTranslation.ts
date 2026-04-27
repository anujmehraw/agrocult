import { useState, useEffect } from 'react';
import { translations } from './translations';

export function useTranslation() {
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    // Read from localStorage on mount
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const t = (key: string): string => {
    // If the language is English or not found, just return the key (which is in English)
    if (language === 'English' || !translations[language]) {
      return key;
    }

    // Try to find the translation in the dictionary
    const translated = translations[language][key];
    
    // Return the translated text if it exists, otherwise fall back to English key
    return translated || key;
  };

  return { t, language };
}
