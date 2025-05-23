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
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-card text-card-foreground rounded-lg">
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

				<Button onClick={onClearSkill} className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 mt-4 mb-4">
					{t("clearSkills")}
				</Button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-card text-card-foreground rounded-lg mt-4">
				{items.map((item, index) => {
					return (
						<div key={index} className="justify-self-center sm:justify-self-auto">
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

				<Button onClick={onClearItem} className="col-span-1 sm:col-span-2 md:col-span-3 mt-4">
					{t("clearItems")}
				</Button>
			</div>
		</div>
	);
};

export default PanelBuilder;
