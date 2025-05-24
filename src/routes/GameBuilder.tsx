import PanelBuilder from "@/components/builder/PanelBuilder";
import PanelItem from "@/components/builder/items/PanelItem";
import PanelSkill from "@/components/builder/skills/PanelSkill";
import { Button } from "@/components/ui/button";
import { DragProvider } from "@/context/DragContext";
import { useLanguage } from "@/context/LanguageContext";
import { allItems } from "@/data/items";
import { allSkills } from "@/data/skills";
import type { Item } from "@/types/Item";
import type { Skill } from "@/types/Skill";
import { createFileRoute } from "@tanstack/react-router";
import html2canvas from "html2canvas-pro";
import { useRef, useState } from "react";

export const Route = createFileRoute("/GameBuilder")({
	component: GameBuilder,
});

function GameBuilder() {
	const { t } = useLanguage();
	const panelRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState<"skills" | "items">("skills");
	const [usedSkills, setUsedSkills] = useState<(Skill | undefined)[]>(Array(12).fill(undefined));
	const [usedItems, setUsedItems] = useState<(Item | undefined)[]>(Array(6).fill(undefined));

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
			alert("Image copied to clipboard!");
		});
	};

	return (
		<DragProvider>
			<div className="min-h-screen bg-background text-foreground p-8">
				<h1 className="text-4xl font-bold text-foreground mb-8">{t("gameBuilder")}</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full">
					<div className="min-w-0">
						{/* Tab Selector */}
						<div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
							<Button
								onClick={() => setActiveTab("skills")}
								variant={activeTab === "skills" ? "default" : "secondary"}
								className="px-4 py-2 rounded w-full sm:w-auto"
							>
								{t("skills")}
							</Button>
							<Button
								onClick={() => setActiveTab("items")}
								variant={activeTab === "items" ? "default" : "secondary"}
								className="px-4 py-2 rounded w-full sm:w-auto"
							>
								{t("items")}
							</Button>
						</div>

						{/* Tab Content */}
						{activeTab === "skills" && <PanelSkill availableSkills={availableSkills} />}
						{activeTab === "items" && <PanelItem availableItems={availableItems} />}
					</div>
					<div className="min-w-0">
						<div className="flex flex-col sm:flex-row gap-2 justify-end mb-4">
							<Button onClick={handleDownload} variant="default" className="px-4 py-2 rounded w-full sm:w-auto">
								{t("download")}
							</Button>
							<Button onClick={handleCopy} variant="secondary" className="px-4 py-2 rounded w-full sm:w-auto">
								{t("copy")}
							</Button>
						</div>
						<div ref={panelRef}>
							<PanelBuilder
								skills={usedSkills}
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
			</div>
		</DragProvider>
	);
}

export default GameBuilder;
