import type { Item } from "@/types/Item";

const basePath = '/last-survival-guide';
const sTierPath = `${basePath}/images/items/S`;
const aTierPath = `${basePath}/images/items/A`;
const bTierPath = `${basePath}/images/items/B`;

export const itemsTierS = [
  { id: "aegis", name: "Aegis", tier: "S", imageUrl: `${sTierPath}/aegis.png` },
  { id: "arcanist's_armor", name: "Arcanist's Armor", tier: "S", imageUrl: `${sTierPath}/arcanists_armor.png` },
  { id: "ballista", name: "Ballista", tier: "S", imageUrl: `${sTierPath}/ballista.png` },
  { id: "desolator_2", name: "Desolator 2", tier: "S", imageUrl: `${sTierPath}/desolator_2.png` },
  { id: "dragon_scale", name: "Dragon Scale", tier: "S", imageUrl: `${sTierPath}/dragon_scale.png` },
  { id: "enhancement_evolved", name: "Apex", tier: "S", imageUrl: `${sTierPath}/enhancement_evolved.png` },
  { id: "gleipnir", name: "Gleipnir", tier: "S", imageUrl: `${sTierPath}/gleipnir.png` },
  { id: "mjollnir", name: "Mjollnir", tier: "S", imageUrl: `${sTierPath}/mjollnir.png` },
  { id: "nullifier", name: "Nullifier", tier: "S", imageUrl: `${sTierPath}/nullifier.png` },
  { id: "radiance_spectre_arcana", name: "Radiance Spectre Arcana", tier: "S", imageUrl: `${sTierPath}/radiance_spectre_arcana.png` },
  { id: "skadi", name: "Skadi", tier: "S", imageUrl: `${sTierPath}/skadi.png` },  
  { id: "tome_of_knowledge", name: "Tome Of Knowledge", tier: "S", imageUrl: `${sTierPath}/tome_of_knowledge.png` },
  { id: "yasha_and_kaya", name: "Yasha And Kaya", tier: "S", imageUrl: `${sTierPath}/yasha_and_kaya.png` },
] as const satisfies readonly Item[];

export const itemsTierA = [
  { id: "armlet_active", name: "Armlet Active", tier: "A", imageUrl: `${aTierPath}/armlet_active.png` },
  { id: "bloodthorn", name: "Bloodthorn", tier: "A", imageUrl: `${aTierPath}/bloodthorn.png` },
  { id: "dagon", name: "Dagon", tier: "A", imageUrl: `${aTierPath}/dagon.png` },
  { id: "desolator", name: "Desolator", tier: "A", imageUrl: `${aTierPath}/desolator.png` },
  { id: "ethereal_blade", name: "Ethereal Blade", tier: "A", imageUrl: `${aTierPath}/ethereal_blade.png` },
  { id: "fusion_rune", name: "Fusion Rune", tier: "A", imageUrl: `${aTierPath}/fusion_rune.png` },
  { id: "hand_of_midas", name: "Hand Of Midas", tier: "A", imageUrl: `${aTierPath}/hand_of_midas.png` },
  { id: "misericorde", name: "Misericorde", tier: "A", imageUrl: `${aTierPath}/misericorde.png` },
  { id: "ninja_gear", name: "Ninja Gear", tier: "A", imageUrl: `${aTierPath}/ninja_gear.png` },
  { id: "quickening_charm", name: "Quickening Charm", tier: "A", imageUrl: `${aTierPath}/quickening_charm.png` },
  { id: "rapier", name: "Rapier", tier: "A", imageUrl: `${aTierPath}/rapier.png` },
  { id: "satanic", name: "Satanic", tier: "A", imageUrl: `${aTierPath}/satanic.png` },
  { id: "shivas_guard", name: "Shivas Guard", tier: "A", imageUrl: `${aTierPath}/shivas_guard.png` },
  { id: "veil_of_discord", name: "Veil Of Discord", tier: "A", imageUrl: `${aTierPath}/veil_of_discord.png` },
  { id: "witless_shako", name: "Witless Shako", tier: "A", imageUrl: `${aTierPath}/witless_shako.png` },
] as const satisfies readonly Item[];;

export const itemsTierB = [
  { id: "arcane_ring", name: "Arcane Ring", tier: "B", imageUrl: `${bTierPath}/arcane_ring.png` },
  { id: "blade_mail", name: "Blade Mail", tier: "B", imageUrl: `${bTierPath}/blade_mail.png` },
  { id: "enchanted_quiver", name: "Enchanted Quiver", tier: "B", imageUrl: `${bTierPath}/enchanted_quiver.png` },
  { id: "eye_of_the_vizier", name: "Eye Of The Vizier", tier: "B", imageUrl: `${bTierPath}/eye_of_the_vizier.png` },
  { id: "fairy's_trinket", name: "Fairy's Trinket", tier: "B", imageUrl: `${bTierPath}/fairys_trinket.png` },
  { id: "gossamer_cape", name: "Gossamer Cape", tier: "B", imageUrl: `${bTierPath}/gossamer_cape.png` },
  { id: "helm_of_the_undying", name: "Helm Of The Undying", tier: "B", imageUrl: `${bTierPath}/helm_of_the_undying.png` },
  { id: "holy_locket", name: "Holy Locket", tier: "B", imageUrl: `${bTierPath}/holy_locket.png` },
  { id: "infused_raindrop", name: "Infused Raindrop", tier: "B", imageUrl: `${bTierPath}/infused_raindrop.png` },
  { id: "magic_lamp", name: "Magic Lamp", tier: "B", imageUrl: `${bTierPath}/magic_lamp.png` },
  { id: "martyrs_plate", name: "Martyrs Plate", tier: "B", imageUrl: `${bTierPath}/martyrs_plate.png` },
  { id: "mekansm", name: "Mekansm", tier: "B", imageUrl: `${bTierPath}/mekansm.png` },
  { id: "paladin_sword", name: "Paladin Sword", tier: "B", imageUrl: `${bTierPath}/paladin_sword.png` },
  { id: "phase_boots", name: "Phase Boots", tier: "B", imageUrl: `${bTierPath}/phase_boots.png` },
  { id: "pocket_roshan", name: "Pocket Roshan", tier: "B", imageUrl: `${bTierPath}/pocket_roshan.png` },
  { id: "psychic_headband", name: "Psychic Headband", tier: "B", imageUrl: `${bTierPath}/psychic_headband.png` },
  { id: "spark_of_courage", name: "Spark Of Courage", tier: "B", imageUrl: `${bTierPath}/spark_of_courage.png` },
  { id: "tranquil_boots", name: "Tranquil Boots", tier: "B", imageUrl: `${bTierPath}/tranquil_boots.png` },
  { id: "vanguard", name: "Vanguard", tier: "B", imageUrl: `${bTierPath}/vanguard.png` },
] as const satisfies readonly Item[];

export const allItems: readonly Item[] = [...itemsTierS, ...itemsTierA, ...itemsTierB];