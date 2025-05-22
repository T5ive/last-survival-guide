import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

type FilterType = "all" | "active" | "active basic" | "active evo" | "active awake" | "passive";

interface SkillFilterProps {
	onFilterChange: (filter: { name: string; type: FilterType }) => void;
}

const SkillFilter: React.FC<SkillFilterProps> = ({ onFilterChange }) => {
	const { t } = useLanguage();
	const [nameFilter, setNameFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState<FilterType>("all");

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setNameFilter(name);
		onFilterChange({ name, type: typeFilter });
	};

	const handleTypeChange = (value: string) => {
		const newType = value as FilterType;
		setTypeFilter(newType);
		onFilterChange({ name: nameFilter, type: newType });
	};

	return (
		<div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
			<Input
				placeholder={t("searchSkillName")}
				value={nameFilter}
				onChange={handleNameChange}
				className="w-full sm:w-1/2"
			/>
			<Select value={typeFilter} onValueChange={handleTypeChange}>
				<SelectTrigger className="w-full sm:w-1/4">
					<SelectValue placeholder={t("skillType")} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">{t("all")}</SelectItem>
					<SelectItem value="active">{t("active")}</SelectItem>
					<SelectItem value="active basic">{t("activeBasic")}</SelectItem>
					<SelectItem value="active evo">{t("activeEvo")}</SelectItem>
					<SelectItem value="active awake">{t("activeAwake")}</SelectItem>
					<SelectItem value="passive">{t("passive")}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SkillFilter;
