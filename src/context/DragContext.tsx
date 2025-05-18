import type { Item } from "@/types/Item";
import type { Skill } from "@/types/Skill";
import { createContext, useContext, useState } from "react";

type DragObject = Skill | Item | null;

interface DragContextType {
	draggingObject: DragObject;
	setDraggingObject: (obj: DragObject) => void;
}

const DragContext = createContext<DragContextType>({
	draggingObject: null,
	setDraggingObject: () => {},
});

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [draggingObject, setDraggingObject] = useState<DragObject>(null);

	return <DragContext.Provider value={{ draggingObject, setDraggingObject }}>{children}</DragContext.Provider>;
};

export const useDragContext = () => useContext(DragContext);

export function isSkill(obj: DragObject): obj is Skill {
	return obj !== null && "type" in obj;
}

export function isItem(obj: DragObject): obj is Item {
	return obj !== null && !("type" in obj);
}
