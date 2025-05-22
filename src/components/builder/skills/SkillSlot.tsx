import { useLanguage } from "@/context/LanguageContext";
import { isSkill, useDragContext } from "@/context/DragContext";
import type { Skill } from "@/types/Skill";
import type { DragEvent } from "react";
import { Button } from "../../ui/button";
interface SkillSlotProps {
	skill?: Skill;
	onDrop?: (skill: Skill) => void;
	onRemove?: () => void;
	allowedSkillType?: "active" | "passive";
	size?: number;
	showSkillType?: boolean;
	showSkillName?: boolean;
	isBuilder: boolean;
}

const SkillSlot: React.FC<SkillSlotProps> = ({
	skill,
	onDrop,
	onRemove,
	allowedSkillType,
	size = 128,
	showSkillType = false,
	showSkillName = false,
	isBuilder,
}) => {
	const { t } = useLanguage();
	const { setDraggingObject, draggingObject } = useDragContext();

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (!isSkill(draggingObject)) {
			e.dataTransfer.dropEffect = "none";
			return;
		}

		if (draggingObject && allowedSkillType && !draggingObject.type.includes(allowedSkillType)) {
			e.dataTransfer.dropEffect = "none";
			return;
		}
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (!draggingObject || !isSkill(draggingObject)) return;

		if (draggingObject && allowedSkillType && !draggingObject.type.includes(allowedSkillType)) {
			return;
		}

		onDrop?.(draggingObject);
	};

	const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
		if (!skill) return;

		e.dataTransfer.effectAllowed = "move";
		setDraggingObject(skill);
	};

	return (
		<div
			className={`bg-muted rounded-lg flex items-center justify-center relative ${
				isBuilder
					? "border-dashed border-2 border-border w-full aspect-square" // Flexible for builder
					: size === 128
					? "w-32 h-32" // Default size for non-builder
					: `w-[${size}px] h-[${size}px]` // Specific size for non-builder
			}`}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			draggable={true}
			onDragStart={handleDragStart}
		>
			{skill ? (
				<>
					<img
						src={skill.imageUrl}
						alt={skill.name}
						className="rounded-lg w-full h-full object-cover"
						draggable={true}
					/>
					{isBuilder && skill && (
						<Button
							type="button"
							onClick={onRemove}
							variant="destructive" // Use destructive variant
							className="absolute top-1 right-1 z-10 flex items-center justify-center w-5 h-5 rounded-full text-sm shadow-md transition duration-150 transform hover:scale-110 active:scale-95 ease-in-out"
							title={t("removeSkill")}
							size="icon" // Use icon size
						>
							&times;
						</Button>
					)}

					{showSkillType && (
						<div className="absolute top-1 right-1 bg-muted text-muted-foreground px-1 py-0.5 rounded-full text-xs">
							{skill.type.charAt(0).toUpperCase() +
								skill.type.slice(1).replaceAll("basic", "").replaceAll("evo", "").replaceAll("awake", "")}
						</div>
					)}
					{showSkillName && (
						<div className="absolute bottom-1 text-center bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
							{skill.name}
						</div>
					)}
				</>
			) : (
				<div className="text-muted-foreground text-sm">{t("emptySlot")}</div>
			)}
		</div>
	);
};

export default SkillSlot;
