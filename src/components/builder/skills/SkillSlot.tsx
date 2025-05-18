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
			className={`bg-gray-700 rounded-lg flex items-center justify-center relative ${
				isBuilder ? "border-dashed border-2 border-gray-500" : ""
			}`}
			style={{ width: `${size}px`, height: `${size}px` }}
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
						className="rounded-lg"
						width={size}
						height={size}
						draggable={true}
					/>
					{isBuilder && skill && (
						<Button
							type="button"
							onClick={onRemove}
							className="absolute top-1 right-1 z-10 flex items-center justify-center w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm shadow-md transition duration-150"
							title="Remove skill"
							size={null}
						>
							&times;
						</Button>
					)}

					{showSkillType && (
						<div className="absolute top-1 right-1 bg-black text-white px-1 py-0.5 rounded-full text-xs">
							{skill.type.charAt(0).toUpperCase() +
								skill.type.slice(1).replaceAll("basic", "").replaceAll("evo", "").replaceAll("awake", "")}
						</div>
					)}
					{showSkillName && (
						<div className="absolute bottom-1 text-center bg-black text-white px-1.5 py-0.5 rounded-full text-xs">
							{skill.name}
						</div>
					)}
				</>
			) : (
				<div className="text-gray-500 text-sm">Empty</div>
			)}
		</div>
	);
};

export default SkillSlot;
