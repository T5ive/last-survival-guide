import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { Skill } from "@/types/Skill";

interface PanelArrayProps {
	skillsInPanel: (Skill | undefined)[];
	enhancements: Array<{ isArray: boolean; isGrimoire: boolean }>;
	onToggleArray: (index: number) => void;
}

const PanelArray: React.FC<PanelArrayProps> = ({ skillsInPanel, enhancements, onToggleArray }) => {
	const { t } = useLanguage();

	return (
		<div className="space-y-4 p-4 bg-card text-card-foreground rounded-lg">
			<h2 className="text-xl font-semibold">{t("arrayTab")}</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{skillsInPanel.map((skill, index) => (
					<div
						key={`panel-array-skill-${index}`}
						className={`p-2 border rounded-lg flex flex-col items-center justify-between ${
							skill ? "border-border" : "border-dashed border-muted-foreground opacity-50"
						}`}
					>
						{skill ? (
							<>
								<div className="flex flex-col items-center text-center">
									<img src={skill.imageUrl} alt={skill.name} className="w-16 h-16 rounded-md object-contain mb-2" />
									<span className="text-sm font-medium">{skill.name}</span>
									<span className="text-xs text-muted-foreground">
										({index < 6 ? t("active") : t("passive")})
									</span>
								</div>
								<Button
									onClick={() => onToggleArray(index)}
									variant={enhancements[index]?.isArray ? "destructive" : "default"}
									className="w-full mt-2 text-xs"
									size="sm"
								>
									{enhancements[index]?.isArray ? t("removeFromArray") : t("addToArray")}
								</Button>
							</>
						) : (
							<div className="text-center text-muted-foreground py-8">
								<span className="text-sm">{t("emptySlot")}</span>
								<span className="text-xs block">({index < 6 ? t("active") : t("passive")})</span>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default PanelArray;
