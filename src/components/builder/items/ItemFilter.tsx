import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

type FilterTier = "all" | "S" | "A" | "B";

interface ItemFilterProps {
	onFilterChange: (filter: { name: string; tier: FilterTier }) => void;
}

const ItemFilter: React.FC<ItemFilterProps> = ({ onFilterChange }) => {
	const { t } = useLanguage();
	const [nameFilter, setNameFilter] = useState("");
	const [tierFilter, setTierFilter] = useState<FilterTier>("all");

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setNameFilter(name);
		onFilterChange({ name, tier: tierFilter });
	};

	const handleTierChange = (value: string) => {
		const newTier = value as FilterTier;
		setTierFilter(newTier);
		onFilterChange({ name: nameFilter, tier: newTier });
	};

	return (
		<div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
			<Input
				placeholder={t("searchItemName")}
				value={nameFilter}
				onChange={handleNameChange}
				className="w-full sm:w-1/2"
			/>
			<Select value={tierFilter} onValueChange={handleTierChange}>
				<SelectTrigger className="w-full sm:w-1/4">
					<SelectValue placeholder={t("itemTier")} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">{t("all")}</SelectItem>
					<SelectItem value="S">{t("tierS")}</SelectItem>
					<SelectItem value="A">{t("tierA")}</SelectItem>
					<SelectItem value="B">{t("tierB")}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default ItemFilter;
