export const translations = {
  EN: {
    // Header
    home: "Home",
    gameBuilder: "Game Builder",
    selectLanguage: "Select language",
    viewSource: "View source on GitHub",
    
    // Language Switcher
    enSwitch: "EN", // Text for the button when current lang is TH, to switch to EN
    thSwitch: "TH", // Text for the button when current lang is EN, to switch to TH

    // GameBuilder page
    skills: "Skills",
    items: "Items",
    download: "Download",
    copy: "Copy",
    
    // PanelBuilder (optional for now, but good to have)
    clearSkills: "Clear Skills",
    clearItems: "Clear Items",

    // ItemSlot / SkillSlot (optional for now)
    emptySlot: "Empty",
    removeItem: "Remove item",
    removeSkill: "Remove skill",

    // ItemFilter / SkillFilter (placeholders)
    searchItemName: "Search item name...",
    searchSkillName: "Search skill name...",
    itemTier: "Item Tier",
    skillType: "Skill Type",
    all: "All",
    tierS: "S",
    tierA: "A",
    tierB: "B",
    active: "Active",
    activeBasic: "Active Basic",
    activeEvo: "Active Evo",
    activeAwake: "Active Awake",
    passive: "Passive",

  },
  TH: {
    // Header
    home: "หน้าแรก",
    gameBuilder: "สร้างเกม",
    selectLanguage: "เลือกภาษา",
    viewSource: "ดูซอร์สโค้ดบน GitHub",

    // Language Switcher
    enSwitch: "ENG", // Text for the button when current lang is TH, to switch to EN
    thSwitch: "ไทย", // Text for the button when current lang is EN, to switch to TH

    // GameBuilder page
    skills: "ทักษะ",
    items: "ไอเทม",
    download: "ดาวน์โหลด",
    copy: "คัดลอก",

    // PanelBuilder (optional for now, but good to have)
    clearSkills: "ล้างทักษะ",
    clearItems: "ล้างไอเทม",

    // ItemSlot / SkillSlot (optional for now)
    emptySlot: "ว่าง",
    removeItem: "ลบไอเทม",
    removeSkill: "ลบทักษะ",

    // ItemFilter / SkillFilter (placeholders)
    searchItemName: "ค้นหาชื่อไอเทม...",
    searchSkillName: "ค้นหาชื่อทักษะ...",
    itemTier: "ระดับไอเทม",
    skillType: "ประเภททักษะ",
    all: "ทั้งหมด",
    tierS: "S", // Assuming S, A, B tiers are universal
    tierA: "A",
    tierB: "B",
    active: "ใช้งาน",
    activeBasic: "ใช้งาน (พื้นฐาน)",
    activeEvo: "ใช้งาน (อีโว)",
    activeAwake: "ใช้งาน (ปลุกพลัง)",
    passive: "ติดตัว",
  },
};

export type Language = keyof typeof translations;
// Define AppTranslations based on the structure of one language (e.g., EN)
// This provides type safety for keys used with the t() function.
export type AppTranslations = typeof translations.EN;
export type TranslationKey = keyof AppTranslations;
