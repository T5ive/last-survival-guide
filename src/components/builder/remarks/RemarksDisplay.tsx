import { useLanguage } from "@/context/LanguageContext";
import type { Skill } from "@/types/Skill";

interface RemarksDisplayProps {
	skillsInPanel: (Skill | undefined)[];
	remarks: string[];
}

const RemarksDisplay: React.FC<RemarksDisplayProps> = ({ skillsInPanel, remarks }) => {
	const { t } = useLanguage();

	const skillsWithRemarks = skillsInPanel
		.map((skill, index) => ({
			skill,
			remark: remarks[index],
			originalIndex: index, // Keep original index if needed, though not directly used in display item key for now
		}))
		.filter((item) => item.skill && item.remark && item.remark.trim() !== "");

	if (skillsWithRemarks.length === 0) {
		return <div className="text-sm text-muted-foreground italic text-center py-2 mb-2">{t("noRemarksAdded")}</div>;
	}

	return (
		<div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg border border-dashed">
			{/* <h3 className="text-sm font-semibold mb-1">{t("remarkTab")}</h3> // Optional title for this section */}
			{skillsWithRemarks.map(({ skill, remark }, displayIndex) => (
				<div key={`remark-display-${skill!.id}-${displayIndex}`} className="flex items-start text-sm">
					<img src={skill!.imageUrl} alt={skill!.name} className="w-8 h-8 object-contain mr-2 flex-shrink-0 rounded" />
					<div>
						<span className="font-semibold">{skill!.name}:</span>
						<span className="ml-1 text-muted-foreground break-words">{remark}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default RemarksDisplay;
