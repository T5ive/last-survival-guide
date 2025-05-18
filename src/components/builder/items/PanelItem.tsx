import type { Item } from "@/types/Item";
import { useEffect, useState } from "react";
import ItemFilter from "./ItemFilter";
import ItemSlot from "./ItemSlot";

type ItemFilterOption = {
	name: string;
	tier: "all" | "S" | "A" | "B";
};

interface PanelItemProps {
	availableItems: Item[];
}

const filterItems = (items: Item[], filter: ItemFilterOption) => {
	let result = [...items];
	if (filter.name) {
		result = result.filter(
			(s) =>
				s.id.toLowerCase().includes(filter.name.toLowerCase()) ||
				s.name.toLowerCase().includes(filter.name.toLowerCase()),
		);
	}
	if (filter.tier !== "all") {
		result = result.filter((s) => s.tier.includes(filter.tier));
	}
	return result;
};

const PanelItem: React.FC<PanelItemProps> = ({ availableItems }) => {
	const [filter, setFilter] = useState<ItemFilterOption>({ name: "", tier: "all" });
	const [filteredItems, setFilteredItems] = useState<Item[]>(availableItems);

	//อัพเดท Panel Item ถ้ามีการเปลี่ยนแปลง
	useEffect(() => {
		setFilteredItems(filterItems(availableItems, filter));
	}, [availableItems, filter]);

	//อัพเดท Panel Item จาก Filter
	const handleFilterChange = (newFilter: ItemFilterOption) => {
		setFilter(newFilter);
	};

	const itemsTierS = filteredItems.filter((s) => s.tier === "S");
	const itemsTierA = filteredItems.filter((s) => s.tier === "A");
	const itemsTierB = filteredItems.filter((s) => s.tier === "B");

	const renderItemGrid = (items: Item[]) => (
		<div className="grid grid-cols-8 gap-4">
			{items.map((item) => (
				<ItemSlot key={item.id} item={item} showItemTier={true} isBuilder={false} />
			))}
		</div>
	);

	return (
		<div className="bg-gray-900 rounded-lg p-4">
			<ItemFilter onFilterChange={handleFilterChange} />
			{renderItemGrid(itemsTierS)}
			<div className="mt-4" />
			{renderItemGrid(itemsTierA)}
			<div className="mt-4" />
			{renderItemGrid(itemsTierB)}
		</div>
	);
};

export default PanelItem;
