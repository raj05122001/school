import { createContext, useState, useContext, useEffect } from 'react';
import Cookies from "js-cookie";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const storedLang = Cookies.get("lang") || "en";
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  const changeLanguage = (language) => {
    setLang(language);
    Cookies?.set("lang", language, { expires: 365 });
    window?.location?.reload(); // Reload page to apply language instantly
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);