import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type FilterTier = "all" | "S" | "A" | "B";

interface ItemFilterProps {
	onFilterChange: (filter: { name: string; tier: FilterTier }) => void;
}

const ItemFilter: React.FC<ItemFilterProps> = ({ onFilterChange }) => {
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
		<div className="flex space-x-4 mb-4">
			<Input
				placeholder="Search item name..."
				value={nameFilter}
				onChange={handleNameChange}
				className="w-1/2 text-white"
			/>
			<Select value={tierFilter} onValueChange={handleTierChange}>
				<SelectTrigger className="w-1/4 text-white">
					<SelectValue placeholder="Item Tier" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="S">S</SelectItem>
					<SelectItem value="A">A</SelectItem>
					<SelectItem value="B">B</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default ItemFilter;
