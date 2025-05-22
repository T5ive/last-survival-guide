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
			return "border-primary"; // Use theme's primary color for S tier
		}
		if (item?.tier === "A") {
			return "border-accent"; // Use theme's accent color for A tier
		}
		if (item?.tier === "B") {
			return "border-secondary"; // Use theme's secondary for B tier
		}
		return "border-border"; // Default fallback
	};

	return (
		<div
			className={`bg-muted rounded-lg flex items-center justify-center relative ${
				isBuilder
					? "border-dashed border-2 border-border w-full aspect-[4/3] max-w-[129px]" // Flexible for builder with max width
					: "w-22 h-16" // Default size for non-builder (e.g. in item list)
			}
			${item ? `border-solid border-2 ${getBorderColor()}` : "border-border"}
			`}
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
						className="rounded-lg object-cover w-full h-full"
						draggable={true}
					/>
					{isBuilder && item && (
						<Button
							type="button"
							onClick={onRemove}
							variant="destructive" // Use destructive variant for styling
							className="absolute top-1 right-1 z-10 flex items-center justify-center w-5 h-5 rounded-full text-sm shadow-md transition duration-150 transform hover:scale-110 active:scale-95 ease-in-out"
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
