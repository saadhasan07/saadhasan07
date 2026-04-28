import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/i18n";

type Language = "en" | "de";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: () => "",
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "de";
}

function getInitialLanguage(defaultLanguage: Language): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  try {
    const savedLanguage = window.localStorage.getItem("language");
    return isLanguage(savedLanguage) ? savedLanguage : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage(defaultLanguage));

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      window.localStorage.setItem("language", language);
    } catch {
      // Ignore storage access errors.
    }
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};
