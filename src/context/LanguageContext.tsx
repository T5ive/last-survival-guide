import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "@/lib/translations";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguageState] = useState<Language>(() => {
		const storedLang = localStorage.getItem("language") as Language | null;
		return storedLang && translations[storedLang] ? storedLang : "EN";
	});

	useEffect(() => {
		localStorage.setItem("language", language);
	}, [language]);

	const setLanguage = (lang: Language) => {
		if (translations[lang]) {
			setLanguageState(lang);
		} else {
			console.warn(`Language "${lang}" not found. Defaulting to EN.`);
			setLanguageState("EN");
			localStorage.setItem("language", "EN");
		}
	};

	const t = (key: TranslationKey): string => {
		return (
			(translations[language] as Record<TranslationKey, string>)[key] ||
			(translations.EN as Record<TranslationKey, string>)[key] ||
			key
		); // Fallback chain: current lang -> EN -> key itself
	};

	return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};
