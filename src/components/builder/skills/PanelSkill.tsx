import type { Skill } from "@/types/Skill";
import { useEffect, useState } from "react";
import SkillFilter from "./SkillFilter";
import SkillSlot from "./SkillSlot";

type SkillFilterOption = {
	name: string;
	type: "all" | "active" | "active basic" | "active evo" | "active awake" | "passive";
};

interface PanelSkillProps {
	availableSkills: Skill[];
}

const filterSkills = (skills: Skill[], filter: SkillFilterOption) => {
	let result = [...skills];
	if (filter.name) {
		result = result.filter(
			(s) =>
				s.id.toLowerCase().includes(filter.name.toLowerCase()) ||
				s.name.toLowerCase().includes(filter.name.toLowerCase()),
		);
	}
	if (filter.type !== "all") {
		result = result.filter((s) => s.type.includes(filter.type));
	}
	return result;
};

const PanelSkill: React.FC<PanelSkillProps> = ({ availableSkills }) => {
	const [filter, setFilter] = useState<SkillFilterOption>({ name: "", type: "all" });
	const [filteredSkills, setFilteredSkills] = useState<Skill[]>(availableSkills);

	//อัพเดท Panel Skill ถ้ามีการเปลี่ยนแปลง
	useEffect(() => {
		setFilteredSkills(filterSkills(availableSkills, filter));
	}, [availableSkills, filter]);

	//อัพเดท Panel Skill จาก Filter
	const handleFilterChange = (newFilter: SkillFilterOption) => {
		setFilter(newFilter);
	};

	const activeSkills = filteredSkills.filter((s) => s.type === "active basic");
	const evoSkills = filteredSkills.filter((s) => s.type === "active evo");
	const awakeSkills = filteredSkills.filter((s) => s.type === "active awake");
	const passiveSkills = filteredSkills.filter((s) => s.type === "passive");

	const renderSkillGrid = (skills: Skill[]) => (
		<div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
			{skills.map((skill) => (
				<SkillSlot key={skill.id} skill={skill} size={68} showSkillType={true} isBuilder={false} />
			))}
		</div>
	);

	return (
		<div className="bg-card text-card-foreground rounded-lg p-4">
			<SkillFilter onFilterChange={handleFilterChange} />
			{renderSkillGrid(activeSkills)}
			<div className="mt-4" />
			{renderSkillGrid(evoSkills)}
			<div className="mt-4" />
			{renderSkillGrid(awakeSkills)}
			<div className="mt-4" />
			{renderSkillGrid(passiveSkills)}
		</div>
	);
};

export default PanelSkill;
