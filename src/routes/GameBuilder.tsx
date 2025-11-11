import PanelArray from "@/components/builder/arrays/PanelArray";
import PanelBuilder from "@/components/builder/PanelBuilder";
import PanelGrimoire from "@/components/builder/grimoires/PanelGrimoire";
import PanelItem from "@/components/builder/items/PanelItem";
import PanelRemark from "@/components/builder/remarks/PanelRemark";
import PanelSkill from "@/components/builder/skills/PanelSkill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added
import { Textarea } from "@/components/ui/textarea"; // Added
import { toast } from "sonner";
import { DragProvider } from "@/context/DragContext";
import { useLanguage } from "@/context/LanguageContext";
import { allItems } from "@/data/items";
import { allSkills } from "@/data/skills";
import type { Item } from "@/types/Item";
import type { Skill } from "@/types/Skill";
import { createFileRoute } from "@tanstack/react-router";
import html2canvas from "html2canvas-pro";
import { useEffect, useRef, useState, useMemo } from "react"; // Added useEffect

export const Route = createFileRoute("/GameBuilder")({
	component: GameBuilder,
});

// Define Build Structure
interface Build {
	name: string;
	timestamp: string;
	usedSkills: (Skill | undefined)[];
	usedItems: (Item | undefined)[];
	skillEnhancements: Array<{ isArray: boolean; isGrimoire: boolean }>;
	skillRemarks: string[];
}

function GameBuilder() {
	const { t } = useLanguage();
	const panelRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState<"skills" | "items" | "array" | "grimoire" | "remark">("skills");
	const [usedSkills, setUsedSkills] = useState<(Skill | undefined)[]>(Array(12).fill(undefined));
	const [usedItems, setUsedItems] = useState<(Item | undefined)[]>(Array(6).fill(undefined));
	const [skillEnhancements, setSkillEnhancements] = useState<Array<{ isArray: boolean; isGrimoire: boolean }>>(
		Array(12).fill({ isArray: false, isGrimoire: false }),
	);
	const [skillRemarks, setSkillRemarks] = useState<string[]>(Array(12).fill(""));

	// State for Saved Builds and UI
	const [savedBuilds, setSavedBuilds] = useState<Build[]>([]);
	const [buildName, setBuildName] = useState<string>("");
	// Remember the most recently loaded build's name to suggest when saving
	const [lastLoadedBuildName, setLastLoadedBuildName] = useState<string | null>(null);
	const [jsonInput, setJsonInput] = useState<string>("");
	const [isSaveModalOpen, setSaveModalOpen] = useState<boolean>(false);
	const [isLoadModalOpen, setLoadModalOpen] = useState<boolean>(false);
	const [isImportModalOpen, setImportModalOpen] = useState<boolean>(false);
	// Autosave toggle and file import ref
	const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(true);
	const importFileRef = useRef<HTMLInputElement | null>(null);

	// Rename state for saved builds
	const [editingBuildTimestamp, setEditingBuildTimestamp] = useState<string | null>(null);
	const [editingBuildName, setEditingBuildName] = useState<string>("");

	// Sorting for Load Build modal
	const [sortBy, setSortBy] = useState<"name" | "timestamp">("timestamp");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const toggleSort = (key: "name" | "timestamp") => {
		if (sortBy === key) {
			setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(key);
			setSortOrder("asc");
		}
	};

	const sortedSavedBuilds = useMemo(() => {
		const arr = [...savedBuilds];
		arr.sort((a, b) => {
			if (sortBy === "name") {
				const na = a.name.toLowerCase();
				const nb = b.name.toLowerCase();
				if (na < nb) return sortOrder === "asc" ? -1 : 1;
				if (na > nb) return sortOrder === "asc" ? 1 : -1;
				return 0;
			}
			// sortBy === 'timestamp'
			const ta = new Date(a.timestamp).getTime();
			const tb = new Date(b.timestamp).getTime();
			if (ta < tb) return sortOrder === "asc" ? -1 : 1;
			if (ta > tb) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
		return arr;
	}, [savedBuilds, sortBy, sortOrder]);

	const startEditBuildName = (timestamp: string, currentName: string) => {
		setEditingBuildTimestamp(timestamp);
		setEditingBuildName(currentName);
	};

	const cancelEditBuildName = () => {
		setEditingBuildTimestamp(null);
		setEditingBuildName("");
	};

	const saveEditedBuildName = (timestamp: string) => {
		const name = editingBuildName.trim();
		if (!name) {
			toast.error(t("buildNameRequired"));
			return;
		}
		// Prevent duplicate names
		if (savedBuilds.some((b) => b.name === name && b.timestamp !== timestamp)) {
			toast.error(t("buildNameExistsOverwrite"));
			return;
		}
		const updated = savedBuilds.map((b) => (b.timestamp === timestamp ? { ...b, name } : b));
		try {
			setSavedBuilds(updated);
			localStorage.setItem("savedGameBuilds", JSON.stringify(updated));
			toast.success(t("buildSaved"));
			cancelEditBuildName();
		} catch (e) {
			console.error(e);
			toast.error(t("errorSavingBuild"));
		}
	};

	const isEmptySkill = usedSkills.every((skill) => skill === undefined);
	const isEmptyItem = usedItems.every((item) => item === undefined);

	// useEffect for Loading Saved Builds on Mount
	useEffect(() => {
		try {
			const storedBuilds = localStorage.getItem("savedGameBuilds");
			if (storedBuilds) {
				setSavedBuilds(JSON.parse(storedBuilds));
			}

			const storedAutosave = localStorage.getItem("autosaveEnabled");
			if (storedAutosave !== null) {
				setAutosaveEnabled(storedAutosave === "true");
			}

			const autosaved = localStorage.getItem("autosavedCurrentBuild");
			if (autosaved) {
				try {
					const parsed = JSON.parse(autosaved);
					applyImportedBuild(parsed);
					toast.success(t("buildSaved"));
				} catch (e) {
					console.warn("Failed to restore autosaved build", e);
				}
			}
		} catch (error) {
			console.error("Failed to load builds from localStorage:", error);
			// Optionally, clear corrupted data: localStorage.removeItem("savedGameBuilds");
		}
	}, [t]);

	// Autosave current build to localStorage when changes occur
	useEffect(() => {
		if (!autosaveEnabled) return;
		try {
			const current = {
				usedSkills,
				usedItems,
				skillEnhancements,
				skillRemarks,
			};
			localStorage.setItem("autosavedCurrentBuild", JSON.stringify(current));
		} catch (e) {
			console.warn("Failed to autosave current build", e);
		}
	}, [usedSkills, usedItems, skillEnhancements, skillRemarks, autosaveEnabled]);

	const applyImportedBuild = (build: Build | Omit<Build, "name" | "timestamp">) => {
		// Validate and set skills
		const validSkills =
			build.usedSkills && Array.isArray(build.usedSkills) && build.usedSkills.length === 12
				? build.usedSkills.map((s) => (s ? allSkills.find((as) => as.id === s.id) || undefined : undefined))
				: Array(12).fill(undefined);
		setUsedSkills(validSkills);

		// Validate and set items
		const validItems =
			build.usedItems && Array.isArray(build.usedItems) && build.usedItems.length === 6
				? build.usedItems.map((i) => (i ? allItems.find((ai) => ai.id === i.id) || undefined : undefined))
				: Array(6).fill(undefined);
		setUsedItems(validItems);

		setSkillEnhancements(
			build.skillEnhancements && Array.isArray(build.skillEnhancements) && build.skillEnhancements.length === 12
				? build.skillEnhancements
				: Array(12).fill({ isArray: false, isGrimoire: false }),
		);
		setSkillRemarks(
			build.skillRemarks && Array.isArray(build.skillRemarks) && build.skillRemarks.length === 12
				? build.skillRemarks
				: Array(12).fill(""),
		);

		// If the imported build includes a name, remember it as the last loaded name
		if ((build as Build).name && typeof (build as Build).name === "string") {
			setLastLoadedBuildName((build as Build).name);
		}
	};

	const handleSkillDropAt = (targetIndex: number, droppedSkill: Skill) => {
		const fromIndex = usedSkills.findIndex((s) => s?.id === droppedSkill.id);
		const isMove = fromIndex !== -1;

		setUsedSkills((prevSlots) => {
			const updatedSlots = [...prevSlots];

			// เอาสกิลที่ลากมาจากตำแหน่งเดิมออก (ถ้ามี)
			if (isMove) {
				updatedSlots[fromIndex] = undefined;
			}

			// ถ้าช่องเป้าหมายมีสกิลอยู่ และลากมาจากช่องอื่น -> สลับตำแหน่ง
			if (isMove && updatedSlots[targetIndex]) {
				const replacedSkill = updatedSlots[targetIndex];
				updatedSlots[fromIndex] = replacedSkill;
			}

			// ใส่สกิลใหม่ลงในช่องเป้าหมาย
			updatedSlots[targetIndex] = droppedSkill;

			return updatedSlots;
		});
	};

	const handleRemoveSkillAt = (index: number) => {
		setUsedSkills((prev) => {
			const updatedSlots = [...prev];
			updatedSlots[index] = undefined;
			return updatedSlots;
		});

		setSkillEnhancements((prev) => {
			const newEnhancements = [...prev];
			newEnhancements[index] = { ...newEnhancements[index], isArray: false, isGrimoire: false };
			return newEnhancements;
		});

		setSkillRemarks((prev) => {
			const newRemarks = [...prev];
			newRemarks[index] = "";
			return newRemarks;
		});
	};

	const handleClearSkill = () => {
		setUsedSkills(Array(12).fill(undefined));
		setSkillEnhancements(Array(12).fill({ isArray: false, isGrimoire: false }));
		setSkillRemarks(Array(12).fill(""));
	};

	const handleUpdateRemark = (index: number, text: string) => {
		setSkillRemarks((prev) => {
			const newRemarks = [...prev];
			newRemarks[index] = text;
			return newRemarks;
		});
	};

	const handleToggleArray = (index: number) => {
		setSkillEnhancements((prev) => {
			const newEnhancements = [...prev];
			newEnhancements[index] = { ...newEnhancements[index], isArray: !newEnhancements[index].isArray };
			return newEnhancements;
		});
	};

	const handleToggleGrimoire = (index: number) => {
		setSkillEnhancements((prev) => {
			const newEnhancements = [...prev];
			newEnhancements[index] = { ...newEnhancements[index], isGrimoire: !newEnhancements[index].isGrimoire };
			return newEnhancements;
		});
	};

	const usedSkillIds = usedSkills.filter((s): s is Skill => s !== undefined).map((s) => s.id);
	const availableSkills = allSkills.filter((s) => !usedSkillIds.includes(s.id));

	const handleItemDropAt = (targetIndex: number, droppedItem: Item) => {
		const fromIndex = usedItems.findIndex((s) => s?.id === droppedItem.id);
		const isMove = fromIndex !== -1;

		setUsedItems((prevSlots) => {
			const updatedSlots = [...prevSlots];

			// เอาสกิลที่ลากมาจากตำแหน่งเดิมออก (ถ้ามี)
			if (isMove) {
				updatedSlots[fromIndex] = undefined;
			}

			// ถ้าช่องเป้าหมายมีสกิลอยู่ และลากมาจากช่องอื่น -> สลับตำแหน่ง
			if (isMove && updatedSlots[targetIndex]) {
				const replacedItem = updatedSlots[targetIndex];
				updatedSlots[fromIndex] = replacedItem;
			}

			// ใส่สกิลใหม่ลงในช่องเป้าหมาย
			updatedSlots[targetIndex] = droppedItem;

			return updatedSlots;
		});
	};

	const handleRemoveItemAt = (index: number) => {
		setUsedItems((prev) => {
			const updatedSlots = [...prev];
			updatedSlots[index] = undefined;
			return updatedSlots;
		});
	};

	const handleClearItem = () => {
		setUsedItems(Array(6).fill(undefined));
	};

	const usedItemIds = usedItems.filter((s): s is Item => s !== undefined).map((s) => s.id);
	const availableItems = allItems.filter((s) => !usedItemIds.includes(s.id));

	const handleCapture = async () => {
		if (!panelRef.current) return;
		const buttons = panelRef.current.querySelectorAll("button");
		try {
			for (const btn of buttons) btn.style.visibility = "hidden";
			return await html2canvas(panelRef.current, {
				backgroundColor: null,
				scale: 2, // เพิ่มความละเอียด
			});
		} catch {
			return null;
		} finally {
			for (const btn of buttons) btn.style.visibility = "visible";
		}
	};

	const handleDownload = async () => {
		const canvas = await handleCapture();
		if (!canvas) return;

		const dataUrl = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "panel-capture.png";
		link.click();
	};

	const handleCopy = async () => {
		const canvas = await handleCapture();
		if (!canvas) return;

		canvas.toBlob(async (blob) => {
			if (!blob) return;
			await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
			toast.success(t("imageCopied"));
		});
	};

	const handleSaveBuild = () => {
		if (!buildName.trim()) {
			toast.error(t("buildNameRequired"));
			return;
		}

		if (isEmptySkill && isEmptyItem) {
			toast.error(t("buildRequired"));
			return;
		}

		const existingIndex = savedBuilds.findIndex((b) => b.name === buildName.trim());

		const newBuild: Build = {
			name: buildName.trim(),
			timestamp: new Date().toISOString(),
			usedSkills,
			usedItems,
			skillEnhancements,
			skillRemarks,
		};

		const save = () => {
			const updatedBuilds = [...savedBuilds];
			if (existingIndex !== -1) {
				updatedBuilds[existingIndex] = newBuild; // แทนที่ตัวเดิม
			} else {
				updatedBuilds.push(newBuild); // เพิ่มใหม่
			}
			try {
				setSavedBuilds(updatedBuilds);
				localStorage.setItem("savedGameBuilds", JSON.stringify(updatedBuilds));
				setBuildName("");
				setSaveModalOpen(false);
				toast.success(t("buildSaved"));
			} catch (error) {
				console.error("Failed to save build:", error);
				toast.error(t("errorSavingBuild"));
			}
		};

		if (existingIndex !== -1) {
			const confirmOverwrite = window.confirm(t("buildNameExistsOverwrite"));
			if (confirmOverwrite) {
				save();
			}
		} else {
			save();
		}
	};

	const handleLoadBuild = (buildToLoad: Build) => {
		if (window.confirm(t("confirmLoadBuild"))) {
			applyImportedBuild(buildToLoad);
			// remember this as the last loaded build name for save suggestions
			setLastLoadedBuildName(buildToLoad.name);
			setLoadModalOpen(false);
		}
	};

	const handleDeleteBuild = (buildNameToDelete: string) => {
		if (window.confirm(t("confirmDeleteBuildPrompt").replace("{buildName}", buildNameToDelete))) {
			const updatedBuilds = savedBuilds.filter((b) => b.name !== buildNameToDelete);
			try {
				setSavedBuilds(updatedBuilds);
				localStorage.setItem("savedGameBuilds", JSON.stringify(updatedBuilds));
			} catch (error) {
				console.error("Failed to delete build:", error);
				toast.error(t("errorDeletingBuild"));
			}
		}
	};

	const handleShareBuild = () => {
		if (isEmptySkill && isEmptyItem) {
			toast.error(t("buildRequired"));
			return;
		}

		const currentBuildObject = {
			usedSkills,
			usedItems,
			skillEnhancements,
			skillRemarks,
		};
		const jsonString = JSON.stringify(currentBuildObject);
		navigator.clipboard.writeText(jsonString).then(
			() => toast.success(t("buildCopied")),
			(err) => {
				console.error("Failed to copy build JSON:", err);
				toast.error(t("errorCopyingJson"));
			},
		);
	};

	const handleImportBuild = () => {
		if (!jsonInput.trim()) {
			toast.warning(t("pasteJsonHere")); // Or a more specific error if it's empty
			return;
		}
		try {
			const buildToImport = JSON.parse(jsonInput);
			// Basic validation (can be more thorough)
			if (
				buildToImport &&
				typeof buildToImport === "object" &&
				"usedSkills" in buildToImport &&
				"usedItems" in buildToImport &&
				"skillEnhancements" in buildToImport &&
				"skillRemarks" in buildToImport
			) {
				applyImportedBuild(buildToImport as Omit<Build, "name" | "timestamp">); // Type assertion
				setJsonInput("");
				setImportModalOpen(false);
				toast.success(t("buildImported"));
			} else {
				toast.error(t("invalidJsonFormat"));
			}
		} catch (error) {
			console.error("Failed to import build:", error);
			toast.error(t("invalidJsonFormat"));
		}
	};

	// Quick Save (save without modal)
	const handleQuickSave = () => {
		if (isEmptySkill && isEmptyItem) {
			toast.error(t("buildRequired"));
			return;
		}

		const name = buildName.trim() || `Quick Build ${new Date().toLocaleString()}`;
		const newBuild: Build = {
			name,
			timestamp: new Date().toISOString(),
			usedSkills,
			usedItems,
			skillEnhancements,
			skillRemarks,
		};
		const updated = [...savedBuilds, newBuild];
		try {
			setSavedBuilds(updated);
			localStorage.setItem("savedGameBuilds", JSON.stringify(updated));
			setBuildName("");
			toast.success(t("buildSaved"));
		} catch (e) {
			console.error(e);
			toast.error(t("errorSavingBuild"));
		}
	};

	const quickSaveRef = useRef(handleQuickSave);

	// Controlled build actions dropdown
	const [buildMenuOpen, setBuildMenuOpen] = useState<boolean>(false);
	const buildMenuRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (buildMenuRef.current && !buildMenuRef.current.contains(e.target as Node)) {
				setBuildMenuOpen(false);
			}
		};
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	}, []);

	// Export current build to a file
	const handleExportToFile = () => {
		if (isEmptySkill && isEmptyItem) {
			toast.error(t("buildRequired"));
			return;
		}
		const data = {
			usedSkills,
			usedItems,
			skillEnhancements,
			skillRemarks,
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "last-survival-build.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	// File import helpers
	const handleOpenFileImport = () => {
		if (!importFileRef.current) return;
		importFileRef.current.value = "";
		importFileRef.current.click();
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed = JSON.parse(String(reader.result));
				if (
					parsed &&
					typeof parsed === "object" &&
					"usedSkills" in parsed &&
					"usedItems" in parsed &&
					"skillEnhancements" in parsed &&
					"skillRemarks" in parsed
				) {
					applyImportedBuild(parsed as Omit<Build, "name" | "timestamp">);
					toast.success(t("buildImported"));
				} else {
					toast.error(t("invalidJsonFormat"));
				}
			} catch (err) {
				console.error(err);
				toast.error(t("invalidJsonFormat"));
			}
		};
		reader.readAsText(file);
	};

	// Keyboard shortcuts: Ctrl+S = quick save, Ctrl+O = open load modal
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				quickSaveRef.current();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "o") {
				e.preventDefault();
				setLoadModalOpen(true);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<DragProvider>
			<div className="bg-background p-8 min-h-screen text-foreground">
				<h1 className="mb-8 font-bold text-foreground text-4xl">{t("gameBuilder")}</h1>
				<div className="gap-8 grid grid-cols-1 md:grid-cols-2 w-full h-full">
					<div className="min-w-0">
						{/* Tab Selector */}
						<div className="flex flex-wrap gap-2 mb-4">
							<Button
								onClick={() => setActiveTab("skills")}
								variant={activeTab === "skills" ? "default" : "secondary"}
								className="px-4 py-2 rounded"
							>
								{t("skills")}
							</Button>
							<Button
								onClick={() => setActiveTab("items")}
								variant={activeTab === "items" ? "default" : "secondary"}
								className="px-4 py-2 rounded"
							>
								{t("items")}
							</Button>
							<Button
								onClick={() => setActiveTab("array")}
								variant={activeTab === "array" ? "default" : "secondary"}
								className="px-4 py-2 rounded"
							>
								{t("arrayTab")}
							</Button>
							<Button
								onClick={() => setActiveTab("grimoire")}
								variant={activeTab === "grimoire" ? "default" : "secondary"}
								className="px-4 py-2 rounded"
							>
								{t("grimoireTab")}
							</Button>
							<Button
								onClick={() => setActiveTab("remark")}
								variant={activeTab === "remark" ? "default" : "secondary"}
								className="px-4 py-2 rounded"
							>
								{t("remarkTab")}
							</Button>
						</div>

						{/* Tab Content */}
						{activeTab === "skills" && <PanelSkill availableSkills={availableSkills} />}
						{activeTab === "items" && <PanelItem availableItems={availableItems} />}
						{activeTab === "array" && (
							<PanelArray
								skillsInPanel={usedSkills}
								enhancements={skillEnhancements}
								onToggleArray={handleToggleArray}
							/>
						)}
						{activeTab === "grimoire" && (
							<PanelGrimoire
								skillsInPanel={usedSkills}
								enhancements={skillEnhancements}
								onToggleGrimoire={handleToggleGrimoire}
							/>
						)}
						{activeTab === "remark" && (
							<PanelRemark skillsInPanel={usedSkills} remarks={skillRemarks} onUpdateRemark={handleUpdateRemark} />
						)}
					</div>
					<div className="min-w-0">
						{/* Action Buttons Group */}
						<div className="flex flex-wrap justify-end gap-2 mb-4">
							<Button onClick={handleDownload} variant="default" className="px-4 py-2 rounded">
								{t("downloadImage")}
							</Button>
							<Button onClick={handleCopy} variant="outline" className="px-4 py-2 rounded">
								{t("copyImage")}
							</Button>
							<Button onClick={handleQuickSave} variant="outline" className="px-4 py-2 rounded">
								{t("quickSave")}
							</Button>
							{/* Compact dropdown for build actions to reduce visual clutter */}
							<div className="relative" ref={buildMenuRef}>
								<Button
									variant="outline"
									className="inline-flex items-center gap-2 px-4 py-2 rounded"
									onClick={() => setBuildMenuOpen((v) => !v)}
									aria-haspopup="menu"
									aria-expanded={buildMenuOpen}
								>
									<span>{t("build")}</span>
									<svg
										className={`w-3 h-3 transition-transform ${buildMenuOpen ? "rotate-180" : ""}`}
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>Toggle build menu</title>
										<path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Button>
								{buildMenuOpen && (
									<div className="right-0 z-50 absolute bg-card shadow-xl mt-2 p-2 rounded w-44">
										<button type="button" className="hover:bg-accent p-2 rounded w-full text-left" onClick={() => { setBuildName((prev) => (prev.trim() ? prev : (lastLoadedBuildName ?? ""))); setSaveModalOpen(true); setBuildMenuOpen(false); }}>
											{t("saveBuild")}
										</button>
										<button type="button" className="hover:bg-accent p-2 rounded w-full text-left" onClick={() => { setLoadModalOpen(true); setBuildMenuOpen(false); }}>
											{t("loadBuild")}
										</button>
										<button type="button" className="hover:bg-accent p-2 rounded w-full text-left" onClick={() => { handleShareBuild(); setBuildMenuOpen(false); }}>
											{t("shareBuild")}
										</button>
										<hr className="my-1" />
										<button type="button" className="hover:bg-accent p-2 rounded w-full text-left" onClick={() => { handleExportToFile(); setBuildMenuOpen(false); }}>
											{t("exportFile")}
										</button>
										<button type="button" className="hover:bg-accent p-2 rounded w-full text-left" onClick={() => { handleOpenFileImport(); setBuildMenuOpen(false); }}>
											{t("importFile")}
										</button>
									</div>
								)}
							</div>
							<label className="flex items-center gap-2 px-2">
								<input
									type="checkbox"
									checked={autosaveEnabled}
									onChange={(e) => {
										setAutosaveEnabled(e.target.checked);
										localStorage.setItem("autosaveEnabled", String(e.target.checked));
									}}
								/>
								<span className="text-sm">{t("autosave")}</span>
							</label>
						</div>

						<div ref={panelRef}>
							<PanelBuilder
								skills={usedSkills}
								skillEnhancements={skillEnhancements}
								skillRemarks={skillRemarks}
								onSkillDropAt={handleSkillDropAt}
								onRemoveSkillAt={handleRemoveSkillAt}
								onClearSkill={handleClearSkill}
								items={usedItems}
								onItemDropAt={handleItemDropAt}
								onRemoveItemAt={handleRemoveItemAt}
								onClearItem={handleClearItem}
							/>
						</div>
					</div>
				</div>

				{/* Save Build Modal */}
				{isSaveModalOpen && (
					<div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
						<div className="bg-card shadow-xl p-6 rounded-lg w-full max-w-md">
							<h2 className="mb-4 font-semibold text-xl">{t("saveBuild")}</h2>
							<Input
								type="text"
								placeholder={t("nameYourBuild")}
								value={buildName}
								onChange={(e) => setBuildName(e.target.value)}
								className="mb-4"
							/>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setSaveModalOpen(false)}>
									{t("cancel")}
								</Button>
								<Button onClick={handleSaveBuild}>{t("save")}</Button>
							</div>
						</div>
					</div>
				)}

				{/* Hidden file input for importing JSON files */}
				<input
					type="file"
					accept="application/json"
					ref={(el) => {
						importFileRef.current = el;
					}}
					onChange={handleFileInputChange}
					style={{ display: "none" }}
				/>

				{/* Load Build Modal */}
				{isLoadModalOpen && (
					<div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
						<div className="bg-card shadow-xl p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
							<h2 className="mb-4 font-semibold text-xl">{t("savedBuilds")}</h2>
							{/* Sort controls */}
							<div className="flex justify-between items-center mb-3">
								<div className="text-secondary-foreground text-sm">{savedBuilds.length} {t("savedBuilds")}</div>
								<div className="flex gap-2">
									<button
										type="button"
										className="hover:bg-accent px-2 py-1 rounded"
										onClick={() => toggleSort("name")}
									>
										{"Name"} {sortBy === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
									</button>
									<button
										type="button"
										className="hover:bg-accent px-2 py-1 rounded"
										onClick={() => toggleSort("timestamp")}
									>
										{"Date"} {sortBy === "timestamp" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
									</button>
								</div>
							</div>
							{sortedSavedBuilds.length === 0 ? (
								<p>{t("noSavedBuilds")}</p>
							) : (
								<ul className="space-y-2">
									{sortedSavedBuilds.map((build) => (
										<li key={build.timestamp} className="flex justify-between items-center p-2 border rounded-md">
											<div>
												{editingBuildTimestamp === build.timestamp ? (
													<div className="flex items-center gap-2">
														<Input
															value={editingBuildName}
															onChange={(e) => setEditingBuildName(e.target.value)}
															className="w-56"
														/>
														<Button size="sm" onClick={() => saveEditedBuildName(build.timestamp)}>
															{t("save")}
														</Button>
														<Button size="sm" variant="outline" onClick={cancelEditBuildName}>
															{t("cancel")}
														</Button>
													</div>
												) : (
													<>
														<span className="font-medium">{build.name}</span>
														<span className="ml-2 text-secondary-foreground text-xs">
															{new Date(build.timestamp).toLocaleString()}
														</span>
													</>
												)}
											</div>
											<div className="flex gap-2">
												{editingBuildTimestamp !== build.timestamp && (
													<Button size="sm" onClick={() => handleLoadBuild(build)}>
														{t("loadBuild")}
													</Button>
												)}
												{editingBuildTimestamp !== build.timestamp && (
													<Button size="sm" variant="secondary" onClick={() => startEditBuildName(build.timestamp, build.name)}>
														{t("edit")}
													</Button>
												)}
												<Button size="sm" variant="destructive" onClick={() => handleDeleteBuild(build.name)}>
													{t("delete")}
												</Button>
											</div>
										</li>
									))}
								</ul>
							)}
							<div className="flex justify-end mt-4">
								<Button variant="outline" onClick={() => setLoadModalOpen(false)}>
									{t("close")}
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Import Build Modal */}
				{isImportModalOpen && (
					<div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
						<div className="bg-card shadow-xl p-6 rounded-lg w-full max-w-md">
							<h2 className="mb-4 font-semibold text-xl">{t("importBuild")}</h2>
							<Textarea
								placeholder={t("pasteJsonHere")}
								value={jsonInput}
								onChange={(e) => setJsonInput(e.target.value)}
								className="mb-4 min-h-[150px]"
							/>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setImportModalOpen(false)}>
									{t("cancel")}
								</Button>
								<Button onClick={handleImportBuild}>{t("import")}</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</DragProvider>
	);
}

export default GameBuilder;
