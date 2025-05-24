import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import type { Skill } from "@/types/Skill";

interface PanelRemarkProps {
	skillsInPanel: (Skill | undefined)[];
	remarks: string[];
	onUpdateRemark: (index: number, text: string) => void;
}

const PanelRemark: React.FC<PanelRemarkProps> = ({ skillsInPanel, remarks, onUpdateRemark }) => {
	const { t } = useLanguage();

	return (
		<div className="space-y-4 p-4 bg-card text-card-foreground rounded-lg">
			<h2 className="text-xl font-semibold">{t("remarkTab")}</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
				{skillsInPanel.map((skill, index) => (
					<div key={`panel-remark-skill-${index}`} className="flex flex-col space-y-2">
						<div className="flex items-center space-x-2">
							{skill ? (
								<img
									src={skill.imageUrl}
									alt={skill.name}
									className="w-10 h-10 rounded-md object-contain"
								/>
							) : (
								<div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
									{index + 1}
								</div>
							)}
							<div>
								<span className={`text-sm font-medium ${!skill ? "text-muted-foreground" : ""}`}>
									{skill ? skill.name : t("emptySlot")}
								</span>
								<span className="text-xs text-muted-foreground block">
									({index < 6 ? t("active") : t("passive")})
								</span>
							</div>
						</div>
						<Input
							type="text"
							placeholder={t("addRemarkPlaceholder")}
							value={remarks[index] || ""}
							onChange={(e) => onUpdateRemark(index, e.target.value)}
							disabled={!skill}
							className="text-sm"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default PanelRemark;
