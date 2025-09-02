import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import nl from './locales/nl.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  nl: { translation: nl },
  fr: { translation: fr },
};

const savedLng = typeof window !== 'undefined' ? localStorage.getItem('app_language') ?? undefined : undefined;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;