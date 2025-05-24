import PanelArray from "@/components/builder/arrays/PanelArray";
import PanelBuilder from "@/components/builder/PanelBuilder";
import PanelGrimoire from "@/components/builder/grimoires/PanelGrimoire";
import PanelItem from "@/components/builder/items/PanelItem";
import PanelRemark from "@/components/builder/remarks/PanelRemark";
import PanelSkill from "@/components/builder/skills/PanelSkill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added
import { Textarea } from "@/components/ui/textarea"; // Added
import { DragProvider, isSkill, useDragContext } from "@/context/DragContext";
import { useLanguage } from "@/context/LanguageContext";
import useBreakpoints from "@/hooks/useBreakpoints";
import { allItems } from "@/data/items";
import { allSkills } from "@/data/skills";
import type { Item } from "@/types/Item";
import type { Skill } from "@/types/Skill";
import { createFileRoute } from "@tanstack/react-router";
import html2canvas from "html2canvas-pro";
import { useEffect, useRef, useState } from "react"; // Added useEffect

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
	const { isUnderSm } = useBreakpoints();
	const { draggingObject } = useDragContext();
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
	const [jsonInput, setJsonInput] = useState<string>("");
	const [isSaveModalOpen, setSaveModalOpen] = useState<boolean>(false);
	const [isLoadModalOpen, setLoadModalOpen] = useState<boolean>(false);
	const [isImportModalOpen, setImportModalOpen] = useState<boolean>(false);

	// useEffect for Loading Saved Builds on Mount
	useEffect(() => {
		try {
			const storedBuilds = localStorage.getItem("savedGameBuilds");
			if (storedBuilds) {
				setSavedBuilds(JSON.parse(storedBuilds));
			}
		} catch (error) {
			console.error("Failed to load builds from localStorage:", error);
			// Optionally, clear corrupted data: localStorage.removeItem("savedGameBuilds");
		}
	}, []);

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
			alert(t("imageCopied"));
		});
	};

	const handleSaveBuild = () => {
		if (!buildName.trim()) {
			alert(t("buildNameRequired"));
			return;
		}
		const newBuild: Build = {
			name: buildName,
			timestamp: new Date().toISOString(),
			usedSkills,
			usedItems,
			skillEnhancements,
			skillRemarks,
		};
		const updatedBuilds = [...savedBuilds, newBuild];
		try {
			setSavedBuilds(updatedBuilds);
			localStorage.setItem("savedGameBuilds", JSON.stringify(updatedBuilds));
			setBuildName("");
			setSaveModalOpen(false);
			alert(t("buildSaved"));
		} catch (error) {
			console.error("Failed to save build:", error);
			alert(t("errorSavingBuild"));
		}
	};

	const handleLoadBuild = (buildToLoad: Build) => {
		if (window.confirm(t("confirmLoadBuild"))) {
			applyImportedBuild(buildToLoad);
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
				alert(t("errorDeletingBuild"));
			}
		}
	};

	const handleShareBuild = () => {
		const currentBuildObject = {
			usedSkills,
			usedItems,
			skillEnhancements,
			skillRemarks,
		};
		const jsonString = JSON.stringify(currentBuildObject);
		navigator.clipboard.writeText(jsonString).then(
			() => alert(t("buildCopied")),
			(err) => {
				console.error("Failed to copy build JSON:", err);
				alert(t("errorCopyingJson"));
			},
		);
	};

	const handleImportBuild = () => {
		if (!jsonInput.trim()) {
			alert(t("pasteJsonHere")); // Or a more specific error if it's empty
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
				alert(t("buildImported"));
			} else {
				alert(t("invalidJsonFormat"));
			}
		} catch (error) {
			console.error("Failed to import build:", error);
			alert(t("invalidJsonFormat"));
		}
	};

	return (
		<DragProvider>
			<div className="min-h-screen bg-background text-foreground p-8">
				<h1 className="text-4xl font-bold text-foreground mb-8">{t("gameBuilder")}</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full">
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
						<div className="flex flex-wrap gap-2 justify-end mb-4">
							<Button onClick={handleDownload} variant="default" className="px-4 py-2 rounded">
								{t("download")}
							</Button>
							<Button onClick={handleCopy} variant="secondary" className="px-4 py-2 rounded">
								{t("copy")}
							</Button>
							<Button onClick={() => setSaveModalOpen(true)} variant="outline" className="px-4 py-2 rounded">
								{t("saveBuild")}
							</Button>
							<Button onClick={() => setLoadModalOpen(true)} variant="outline" className="px-4 py-2 rounded">
								{t("loadBuild")}
							</Button>
							<Button onClick={handleShareBuild} variant="outline" className="px-4 py-2 rounded">
								{t("shareBuild")}
							</Button>
							<Button onClick={() => setImportModalOpen(true)} variant="outline" className="px-4 py-2 rounded">
								{t("importBuild")}
							</Button>
						</div>

						{isUnderSm && (
							<div className="mini-panel-builder mb-4 p-2 border border-dashed border-border rounded-lg bg-card">
								<h3 className="text-sm font-semibold mb-2 text-center">{t("miniPanelDragHelper")}</h3>
								<div className="grid grid-cols-6 gap-1">
									{usedSkills.map((skill, index) => {
										const isActiveSlot = index < 6;
										const isPassiveSlot = index >= 6;
										return (
											<div
												key={`mini-slot-${index}`}
												className={`aspect-square bg-muted rounded flex items-center justify-center border ${
													draggingObject &&
													isSkill(draggingObject) &&
													(
														(isActiveSlot && (draggingObject as Skill).type.includes("active")) ||
															(isPassiveSlot && (draggingObject as Skill).type.includes("passive"))
													)
														? "border-primary scale-105"
														: "border-border"
												} transition-all duration-150`}
												onDragOver={(e) => {
													e.preventDefault();
													if (draggingObject && isSkill(draggingObject)) {
														const dragSkill = draggingObject as Skill;
														if (
															(isActiveSlot && dragSkill.type.includes("active")) ||
															(isPassiveSlot && dragSkill.type.includes("passive"))
														) {
															e.dataTransfer.dropEffect = "move";
														} else {
															e.dataTransfer.dropEffect = "none";
														}
													} else {
														e.dataTransfer.dropEffect = "none";
													}
												}}
												onDrop={(e) => {
													e.preventDefault();
													if (draggingObject && isSkill(draggingObject)) {
														const droppedSkill = draggingObject as Skill;
														if (
															(isActiveSlot && droppedSkill.type.includes("active")) ||
															(isPassiveSlot && droppedSkill.type.includes("passive"))
														) {
															handleSkillDropAt(index, droppedSkill);
														}
													}
												}}
											>
												{skill ? (
													<img src={skill.imageUrl} alt={skill.name} className="w-full h-full object-contain rounded" />
												) : (
													<span className="text-xs text-muted-foreground">{index + 1}</span>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}
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
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
							<h2 className="text-xl font-semibold mb-4">{t("saveBuild")}</h2>
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

				{/* Load Build Modal */}
				{isLoadModalOpen && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
							<h2 className="text-xl font-semibold mb-4">{t("savedBuilds")}</h2>
							{savedBuilds.length === 0 ? (
								<p>{t("noSavedBuilds")}</p>
							) : (
								<ul className="space-y-2">
									{savedBuilds.map((build) => (
										<li key={build.timestamp} className="flex justify-between items-center p-2 border rounded-md">
											<div>
												<span className="font-medium">{build.name}</span>
												<span className="text-xs text-muted-foreground ml-2">
													{new Date(build.timestamp).toLocaleString()}
												</span>
											</div>
											<div className="flex gap-2">
												<Button size="sm" onClick={() => handleLoadBuild(build)}>
													{t("loadBuild")}
												</Button>
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
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
							<h2 className="text-xl font-semibold mb-4">{t("importBuild")}</h2>
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
