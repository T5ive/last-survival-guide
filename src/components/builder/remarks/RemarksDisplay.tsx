import type { Skill } from "@/types/Skill";

interface RemarksDisplayProps {
	skillsInPanel: (Skill | undefined)[];
	remarks: string[];
}

const RemarksDisplay: React.FC<RemarksDisplayProps> = ({ skillsInPanel, remarks }) => {

	const skillsWithRemarks = skillsInPanel
		.map((skill, index) => ({
			skill,
			remark: remarks[index],
			originalIndex: index, // Keep original index if needed, though not directly used in display item key for now
		}))
		.filter((item) => item.skill && item.remark && item.remark.trim() !== "");

	return (
		<div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg border border-dashed">
			{/* <h3 className="text-sm font-semibold mb-1">{t("remarkTab")}</h3> // Optional title for this section */}
			<div className="flex items-start text-sm">
				<span
					className="w-5 h-5 mr-2 
							flex items-center justify-center
							rounded-full bg-red-500 text-white text-sm"
				>
					★
				</span>
				<div>
					<span className="font-semibold mr-5">Array</span>
				</div>
				<span
					className="w-5 h-5 mr-2 
							flex items-center justify-center
							rounded-full bg-purple-500 text-white text-sm"
				>
					★
				</span>
				<div>
					<span className="font-semibold">Grimoire</span>
				</div>
			</div>

			{skillsWithRemarks.length > 0 && <hr className="my-2" />}

			{skillsWithRemarks.map(({ skill, remark }, displayIndex) => (
				<div key={`remark-display-${skill!.id}-${displayIndex}`} className="flex items-center text-sm">
					<img src={skill!.imageUrl} alt={skill!.name} className="w-8 h-8 object-contain mr-2 flex-shrink-0 rounded" />
					<div className="align-text-bottom">
						<span className="font-semibold">{skill!.name}:</span>
						<span className="ml-1 text-muted-foreground break-words">{remark}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default RemarksDisplay;
