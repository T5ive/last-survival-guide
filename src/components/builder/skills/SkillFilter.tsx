import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type FilterType = "all" | "active" | "active basic" | "active evo" | "active awake" | "passive";

interface SkillFilterProps {
	onFilterChange: (filter: { name: string; type: FilterType }) => void;
}

const SkillFilter: React.FC<SkillFilterProps> = ({ onFilterChange }) => {
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
		<div className="flex space-x-4 mb-4">
			<Input
				placeholder="Search skill name..."
				value={nameFilter}
				onChange={handleNameChange}
				className="w-1/2 text-white"
			/>
			<Select value={typeFilter} onValueChange={handleTypeChange}>
				<SelectTrigger className="w-1/4 text-white">
					<SelectValue placeholder="Skill Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="active">Active</SelectItem>
					<SelectItem value="active basic">Active Basic</SelectItem>
					<SelectItem value="active evo">Active Evo</SelectItem>
					<SelectItem value="active awake">Active Awake</SelectItem>
					<SelectItem value="passive">Passive</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SkillFilter;
