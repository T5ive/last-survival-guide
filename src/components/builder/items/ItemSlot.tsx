import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
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
	const { t } = useLanguage();
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
		return "";
	};

	return (
		<div
			className={`bg-muted rounded-lg flex items-center justify-center relative w-full aspect-[4/3] ${
				isBuilder ? "border-dashed border-2 max-w-[128px]" : "max-w-[88px]"
			}
			${item ? `border-solid border-3 ${getBorderColor()}` : "border-gray-500"}
			`}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			draggable={true}
			onDragStart={handleDragStart}
		>
			{item ? (
				<>
					<img src={item.imageUrl} alt={item.name} className="rounded-sm w-full h-full object-cover" draggable={true} />
					{isBuilder && item && (
						<Button
							type="button"
							onClick={onRemove}
							variant="destructive" // Use destructive variant for styling
							className="absolute top-1 right-1 z-10 flex items-center justify-center w-5 h-5 rounded-full text-sm shadow-md transition duration-150 transform hover:scale-110 active:scale-95 ease-in-out cursor-pointer"
							title={t("removeItem")}
							size="icon" // Use icon size for small button
						>
							&times;
						</Button>
					)}

					{showItemTier && (
						<div className="absolute top-1 right-1 bg-muted text-muted-foreground px-1 py-0.5 rounded-full text-xs">
							{item.tier}
						</div>
					)}
					{showItemName && (
						<div className="absolute bottom-1 text-center bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
							{item.name}
						</div>
					)}
				</>
			) : (
				<div className="text-muted-foreground text-sm">{t("emptySlot")}</div>
			)}
		</div>
	);
};

export default ItemSlot;
