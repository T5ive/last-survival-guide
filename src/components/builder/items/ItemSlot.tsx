import { Button } from "@/components/ui/button";
import { isItem, useDragContext } from "@/context/DragContext";
import type { Item } from "@/types/Item";
import type { DragEvent } from "react";
interface ItemSlotProps {
	item?: Item;
	onDrop?: (item: Item) => void;
	onRemove?: () => void;
	showItemTier?: boolean;
	showItemName?: boolean;
	isBuilder: boolean;
}

const ItemSlot: React.FC<ItemSlotProps> = ({
	item,
	onDrop,
	onRemove,
	showItemTier = false,
	showItemName = false,
	isBuilder,
}) => {
	const { setDraggingObject, draggingObject } = useDragContext();

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (draggingObject && !isItem(draggingObject)) {
			e.dataTransfer.dropEffect = "none";
			return;
		}
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (!draggingObject || !isItem(draggingObject)) return;

		onDrop?.(draggingObject);
	};

	const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
		if (!item) return;

		e.dataTransfer.effectAllowed = "move";
		setDraggingObject(item);
	};

	const getBorderColor = () => {
		if (item?.tier === "S") {
			return "border-amber-400";
		}
		if (item?.tier === "A") {
			return "border-purple-700";
		}
		if (item?.tier === "B") {
			return "border-green-400";
		}
	};

	return (
		<div
			className={`bg-gray-700 rounded-lg flex items-center justify-center relative ${
				isBuilder ? "border-dashed border-2 " : ""
			}
			${item ? `border-solid border-2 ${getBorderColor()}` : "border-gray-500"}
			`}
			style={{ width: `${isBuilder ? 88 * 2 : 88}px`, height: `${isBuilder ? 64 * 2 : 64}px` }}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			draggable={true}
			onDragStart={handleDragStart}
		>
			{item ? (
				<>
					<img
						src={item.imageUrl}
						alt={item.name}
						className="rounded-lg"
						width={isBuilder ? 88 * 2 : 88}
						height={isBuilder ? 64 * 2 : 64}
						draggable={true}
					/>
					{isBuilder && item && (
						<Button
							type="button"
							onClick={onRemove}
							className="absolute top-1 right-1 z-10 flex items-center justify-center w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm shadow-md transition duration-150"
							title="Remove item"
							size={null}
						>
							&times;
						</Button>
					)}

					{showItemTier && (
						<div className="absolute top-1 right-1 bg-black text-white px-1 py-0.5 rounded-full text-xs">
							{item.tier}
						</div>
					)}
					{showItemName && (
						<div className="absolute bottom-1 text-center bg-black text-white px-1.5 py-0.5 rounded-full text-xs">
							{item.name}
						</div>
					)}
				</>
			) : (
				<div className="text-gray-500 text-sm">Empty</div>
			)}
		</div>
	);
};

export default ItemSlot;
