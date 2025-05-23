import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { Item } from "@/types/Item";
import type { Skill } from "@/types/Skill";
import ItemSlot from "./items/ItemSlot";
import SkillSlot from "./skills/SkillSlot";

interface PanelBuilderProps {
	skills: (Skill | undefined)[];
	onSkillDropAt: (index: number, skill: Skill) => void;
	onRemoveSkillAt: (index: number) => void;
	onClearSkill: () => void;

	items: (Item | undefined)[];
	onItemDropAt: (index: number, item: Item) => void;
	onRemoveItemAt: (index: number) => void;
	onClearItem: () => void;
}

const PanelBuilder: React.FC<PanelBuilderProps> = ({
	skills,
	onSkillDropAt,
	onRemoveSkillAt,
	onClearSkill,

	items,
	onItemDropAt,
	onRemoveItemAt,
	onClearItem,
}) => {
	const { t } = useLanguage();
	return (
		<div>
			<div className="grid grid-cols-6 gap-4 p-4 bg-card text-card-foreground rounded-lg">
				{skills.map((skill, index) => (
					<SkillSlot
						key={index}
						skill={skill}
						onDrop={(droppedSkill) => onSkillDropAt(index, droppedSkill)}
						onRemove={() => onRemoveSkillAt(index)}
						allowedSkillType={index < 6 ? "active" : "passive"}
						showSkillName={true}
						isBuilder={true}
					/>
				))}

				<Button onClick={onClearSkill} className="col-span-6">
					{t("clearSkills")}
				</Button>
			</div>
			{/* <div className="grid grid-cols-3 gap-y-4 justify-items-center p-4 bg-card rounded-lg"> */}
			<div className="grid grid-cols-3 gap-y-4 p-4 bg-card text-card-foreground rounded-lg mt-4">
				{items.map((item, index) => {
					// ระบุการจัดวางแต่ละคอลัมน์
					let justifyClass = "";
					if (index % 3 === 0)
						justifyClass = "justify-self-end"; // คอลัมน์ซ้าย
					else if (index % 3 === 1)
						justifyClass = "justify-self-center"; // คอลกลาง
					else if (index % 3 === 2) justifyClass = "justify-self-start"; // คอลขวา

					return (
						<div key={index} className={`${justifyClass} w-full max-w-[129px] aspect-[4/3]`}>
							<ItemSlot
								item={item}
								onDrop={(droppedItem) => onItemDropAt(index, droppedItem)}
								onRemove={() => onRemoveItemAt(index)}
								showItemName={true}
								isBuilder={true}
							/>
						</div>
					);
				})}

				<Button onClick={onClearItem} className="col-span-3">
					{t("clearItems")}
				</Button>
			</div>
		</div>
	);
};

export default PanelBuilder;
