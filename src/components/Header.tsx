import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ui/ThemeToggle";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";

// Simple Globe Icon SVG
const GlobeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-globe"
	>
		<title>Localize</title>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
		<path d="M2 12h20" />
	</svg>
);

// Simple GitHub Icon SVG
const GitHubIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-github"
	>
		<title>Github</title>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
		<path d="M9 18c-4.51 2-5-2-7-2" />
	</svg>
);

export default function Header() {
	const { language, setLanguage, t } = useLanguage();

	const toggleLanguage = () => {
		setLanguage(language === "EN" ? "TH" : "EN");
	};

	return (
		<header className="p-2 flex flex-col sm:flex-row gap-2 justify-between items-center">
			<nav className="flex flex-col sm:flex-row">
				<div className="px-2 font-bold">
					<Link to="/">{t("home")}</Link>
				</div>
				<div className="px-2 font-bold">
					<Link to="/GameBuilder">{t("gameBuilder")}</Link>
				</div>
			</nav>
			<div className="flex items-center gap-1 sm:gap-2">
				<Button variant="ghost" size="sm" aria-label={t("selectLanguage")} onClick={toggleLanguage}>
					<GlobeIcon />
					<span className="ml-1.5">{language === "EN" ? t("enSwitch") : t("thSwitch")}</span>
				</Button>
				<ThemeToggle />

				<a
					href="https://github.com/T5ive/last-survival-guide" // Placeholder URL
					target="_blank"
					rel="noopener noreferrer"
					aria-label={t("viewSource")}
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9" // Classes from Button variant="ghost" size="icon"
				>
					<GitHubIcon />
				</a>
			</div>
		</header>
	);
}
