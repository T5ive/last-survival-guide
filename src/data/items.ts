import type { Item } from "@/types/Item";

export const itemsTierS = [
  { id: "aegis", name: "Aegis", tier: "S", imageUrl: "/images/items/S/aegis.png" },
  { id: "arcanist's_armor", name: "Arcanist's Armor", tier: "S", imageUrl: "/images/items/S/arcanists_armor.png" },
  { id: "ballista", name: "Ballista", tier: "S", imageUrl: "/images/items/S/ballista.png" },
  { id: "desolator_2", name: "Desolator 2", tier: "S", imageUrl: "/images/items/S/desolator_2.png" },
  { id: "dragon_scale", name: "Dragon Scale", tier: "S", imageUrl: "/images/items/S/dragon_scale.png" },
  { id: "enhancement_evolved", name: "Enhancement Evolved", tier: "S", imageUrl: "/images/items/S/enhancement_evolved.png" },
  { id: "gleipnir", name: "Gleipnir", tier: "S", imageUrl: "/images/items/S/gleipnir.png" },
  { id: "mjollnir", name: "Mjollnir", tier: "S", imageUrl: "/images/items/S/mjollnir.png" },
  { id: "nullifier", name: "Nullifier", tier: "S", imageUrl: "/images/items/S/nullifier.png" },
  { id: "radiance_spectre_arcana", name: "Radiance Spectre Arcana", tier: "S", imageUrl: "/images/items/S/radiance_spectre_arcana.png" },
  { id: "skadi", name: "Skadi", tier: "S", imageUrl: "/images/items/S/skadi.png" },
  { id: "yasha_and_kaya", name: "Yasha And Kaya", tier: "S", imageUrl: "/images/items/S/yasha_and_kaya.png" },
] as const satisfies readonly Item[];

export const itemsTierA = [
  { id: "armlet_active", name: "Armlet Active", tier: "A", imageUrl: "/images/items/A/armlet_active.png" },
  { id: "bloodthorn", name: "Bloodthorn", tier: "A", imageUrl: "/images/items/A/bloodthorn.png" },
  { id: "dagon", name: "Dagon", tier: "A", imageUrl: "/images/items/A/dagon.png" },
  { id: "desolator", name: "Desolator", tier: "A", imageUrl: "/images/items/A/desolator.png" },
  { id: "ethereal_blade", name: "Ethereal Blade", tier: "A", imageUrl: "/images/items/A/ethereal_blade.png" },
  { id: "fusion_rune", name: "Fusion Rune", tier: "A", imageUrl: "/images/items/A/fusion_rune.png" },
  { id: "hand_of_midas", name: "Hand Of Midas", tier: "A", imageUrl: "/images/items/A/hand_of_midas.png" },
  { id: "misericorde", name: "Misericorde", tier: "A", imageUrl: "/images/items/A/misericorde.png" },
  { id: "ninja_gear", name: "Ninja Gear", tier: "A", imageUrl: "/images/items/A/ninja_gear.png" },
  { id: "quickening_charm", name: "Quickening Charm", tier: "A", imageUrl: "/images/items/A/quickening_charm.png" },
  { id: "rapier", name: "Rapier", tier: "A", imageUrl: "/images/items/A/rapier.png" },
  { id: "satanic", name: "Satanic", tier: "A", imageUrl: "/images/items/A/satanic.png" },
  { id: "shivas_guard", name: "Shivas Guard", tier: "A", imageUrl: "/images/items/A/shivas_guard.png" },
  { id: "veil_of_discord", name: "Veil Of Discord", tier: "A", imageUrl: "/images/items/A/veil_of_discord.png" },
  { id: "witless_shako", name: "Witless Shako", tier: "A", imageUrl: "/images/items/A/witless_shako.png" },
] as const satisfies readonly Item[];;

export const itemsTierB = [
  { id: "arcane_ring", name: "Arcane Ring", tier: "B", imageUrl: "/images/items/B/arcane_ring.png" },
  { id: "blade_mail", name: "Blade Mail", tier: "B", imageUrl: "/images/items/B/blade_mail.png" },
  { id: "enchanted_quiver", name: "Enchanted Quiver", tier: "B", imageUrl: "/images/items/B/enchanted_quiver.png" },
  { id: "eye_of_the_vizier", name: "Eye Of The Vizier", tier: "B", imageUrl: "/images/items/B/eye_of_the_vizier.png" },
  { id: "fairy's_trinket", name: "Fairy's Trinket", tier: "B", imageUrl: "/images/items/B/fairys_trinket.png" },
  { id: "gossamer_cape", name: "Gossamer Cape", tier: "B", imageUrl: "/images/items/B/gossamer_cape.png" },
  { id: "helm_of_the_undying", name: "Helm Of The Undying", tier: "B", imageUrl: "/images/items/B/helm_of_the_undying.png" },
  { id: "holy_locket", name: "Holy Locket", tier: "B", imageUrl: "/images/items/B/holy_locket.png" },
  { id: "infused_raindrop", name: "Infused Raindrop", tier: "B", imageUrl: "/images/items/B/infused_raindrop.png" },
  { id: "magic_lamp", name: "Magic Lamp", tier: "B", imageUrl: "/images/items/B/magic_lamp.png" },
  { id: "martyrs_plate", name: "Martyrs Plate", tier: "B", imageUrl: "/images/items/B/martyrs_plate.png" },
  { id: "mekansm", name: "Mekansm", tier: "B", imageUrl: "/images/items/B/mekansm.png" },
  { id: "paladin_sword", name: "Paladin Sword", tier: "B", imageUrl: "/images/items/B/paladin_sword.png" },
  { id: "phase_boots", name: "Phase Boots", tier: "B", imageUrl: "/images/items/B/phase_boots.png" },
  { id: "pocket_roshan", name: "Pocket Roshan", tier: "B", imageUrl: "/images/items/B/pocket_roshan.png" },
  { id: "psychic_headband", name: "Psychic Headband", tier: "B", imageUrl: "/images/items/B/psychic_headband.png" },
  { id: "spark_of_courage", name: "Spark Of Courage", tier: "B", imageUrl: "/images/items/B/spark_of_courage.png" },
  { id: "tranquil_boots", name: "Tranquil Boots", tier: "B", imageUrl: "/images/items/B/tranquil_boots.png" },
  { id: "vanguard", name: "Vanguard", tier: "B", imageUrl: "/images/items/B/vanguard.png" },
] as const satisfies readonly Item[];

export const allItems: readonly Item[] = [...itemsTierS, ...itemsTierA, ...itemsTierB];