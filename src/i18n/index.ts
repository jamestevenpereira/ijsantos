import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pt from "./pt.json";

i18n.use(initReactI18next).init({
  lng: "pt",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    pt: { translation: pt },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
