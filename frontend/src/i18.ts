import i18n from 'i18next';
import en from "./i18n/en/translation.json";
import he from './i18n/he/translation.json';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    debug: true,
    fallbackLng: 'he',
    interpolation: {
        escapeValue: false, // React already does escaping
    },
    resources: {
        en: {
            translation: en
        },
        he: {
            translation: he
        }
    }
});

export default i18n;