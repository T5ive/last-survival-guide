import { useLanguage } from "@/context/LanguageContext";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/Changelog")({
	component: Changelog,
});

function Changelog() {
	const { language } = useLanguage();
	const [content, setContent] = useState("");

	useEffect(() => {
		const fileName = language === "TH" ? "changelog-th.md" : "changelog.md";
		fetch(`/last-survival-guide/${fileName}`)
			.then((res) => res.text())
			.then((text) => setContent(text));
	}, [language]);

	return (
		<div className="prose dark:prose-invert max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
			<h1>Changelog</h1>
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
}

export default Changelog;
