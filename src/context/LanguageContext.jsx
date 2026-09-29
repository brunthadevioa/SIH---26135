import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'English', fullLabel: 'English', flag: '🌐' },
  { code: 'mr', label: 'मराठी', fullLabel: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी', fullLabel: 'हिंदी (Hindi)', flag: '🇮🇳' },
];

export const TRANSLATIONS = {
  en: {
    brandName: 'MahaSkill 360',
    brandSub: 'Government of Maharashtra Skill Mission',
    home: 'Home',
    candidatePortal: 'Candidate Portal',
    providerPortal: 'Training Provider',
    trainerPortal: 'Trainer',
    employerPortal: 'HR / Employer',
    governmentPortal: 'Government Portal',
    candidatesCount: 'Candidates',
    notifications: 'Notifications',
    roleSwitcher: 'Demo Role Switcher',
    logout: 'Logout',
    language: 'Language',
    login: 'Login',
    register: 'Register',
  },
  mr: {
    brandName: 'महास्किल ३६०',
    brandSub: 'महाराष्ट्र शासन कौशल्य विकास अभियान',
    home: 'मुख्यपृष्ठ',
    candidatePortal: 'उमेदवार पोर्टल',
    providerPortal: 'प्रशिक्षण संस्था',
    trainerPortal: 'प्रशिक्षक',
    employerPortal: 'नियोक्ता / एचआर',
    governmentPortal: 'शासन पोर्टल',
    candidatesCount: 'नोंदणीकृत उमेदवार',
    notifications: 'सूचना व संदेश',
    roleSwitcher: 'भूमिका बदला (डेमो)',
    logout: 'लॉग आउट',
    language: 'भाषा',
    login: 'लॉगिन करा',
    register: 'नोंदणी करा',
  },
  hi: {
    brandName: 'महास्किल 360',
    brandSub: 'महाराष्ट्र शासन कौशल विकास मिशन',
    home: 'मुख्य पृष्ठ',
    candidatePortal: 'उम्मीदवार पोर्टल',
    providerPortal: 'प्रशिक्षण संस्थान',
    trainerPortal: 'प्रशिक्षक',
    employerPortal: 'नियोक्ता / एचआर',
    governmentPortal: 'शासन पोर्टल',
    candidatesCount: 'पंजीकृत उम्मीदवार',
    notifications: 'सूचनाएं व संदेश',
    roleSwitcher: 'भूमिका बदलें (डेमो)',
    logout: 'लॉग आउट',
    language: 'भाषा',
    login: 'लॉगिन करें',
    register: 'पंजीकरण करें',
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('mahaskill_lang') || 'en';
  });

  const applyGoogleTranslate = (langCode) => {
    try {
      const host = window.location.hostname;
      if (langCode === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=/en/en; path=/;';
        if (host) {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.' + host + '; path=/;';
          document.cookie = 'googtrans=/en/en; domain=.' + host + '; path=/;';
        }
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        if (host) {
          document.cookie = `googtrans=/en/${langCode}; domain=.${host}; path=/;`;
        }
      }

      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.warn('Language sync error:', e);
    }
  };

  const setLanguage = (langCode) => {
    if (langCode === 'en' || langCode === 'mr' || langCode === 'hi') {
      setLanguageState(langCode);
      localStorage.setItem('mahaskill_lang', langCode);
      applyGoogleTranslate(langCode);
    }
  };

  const t = (keyOrPhrase, defaultText = '') => {
    if (!keyOrPhrase) return '';

    if (language === 'en') {
      if (TRANSLATIONS.en && TRANSLATIONS.en[keyOrPhrase] !== undefined) {
        return TRANSLATIONS.en[keyOrPhrase];
      }
      return defaultText || keyOrPhrase;
    }

    if (TRANSLATIONS[language] && TRANSLATIONS[language][keyOrPhrase] !== undefined) {
      return TRANSLATIONS[language][keyOrPhrase];
    }

    return defaultText || keyOrPhrase;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key, defaultText) => defaultText || key,
      languages: LANGUAGES
    };
  }
  return context;
}
