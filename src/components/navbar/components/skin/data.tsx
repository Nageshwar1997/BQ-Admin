import { LevelTwoCategoryType } from "../../types";
import {
  NightCreamIcon,
  EyeCreamIcon,
  SerumIcon,
  SkinCareKitIcon,
  CleanserIcon,
  FaceWashIcon,
  ExfoliatorIcon,
  SunscreenIcon,
  AquaholicIcon,
  CoffeeCultureIcon,
  CitrusIcon,
  AllIcon,
  SheetMaskIcon,
  FacePackIcon,
} from "../icons";

const basePath = "/skin";

export const moisturizers: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Moisturizers",
  category: "moisturizers",
  path: `${basePath}/moisturizers`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Night Cream",
      category: "night_cream",
      path: `${basePath}/moisturizers/night-cream`,
      icon: NightCreamIcon,
      description: "Deeply hydrates and repairs tired skin while you sleep.",
    },
    {
      id: 2,
      level: 3,
      label: "Eye Cream",
      category: "eye_cream",
      path: `${basePath}/moisturizers/eye-cream`,
      icon: EyeCreamIcon,
      description: "Reduces puffiness, dark circles, and fine lines quickly.",
    },
    {
      id: 3,
      level: 3,
      label: "Serum",
      category: "serum",
      path: `${basePath}/moisturizers/serum`,
      icon: SerumIcon,
      description: "Nourishes skin with essential vitamins for a radiant glow.",
    },
    {
      id: 4,
      level: 3,
      label: "Skincare Kit",
      category: "skincare_kit",
      path: `${basePath}/moisturizers/skincare-kit`,
      icon: SkinCareKitIcon,
      description: "Complete care sets for all skin types and beauty concerns.",
    },
  ],
};

export const cleansing_and_exfoliation: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Cleansing & Exfoliation",
  category: "cleansing_and_exfoliation",
  path: `${basePath}/cleansing-and-exfoliation`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Cleanser",
      category: "cleanser",
      path: `${basePath}/cleansing-and-exfoliation/cleanser`,
      icon: CleanserIcon,
      description:
        "Gently removes dirt, excess oil, and makeup for clean skin.",
    },
    {
      id: 2,
      level: 3,
      label: "Face Wash",
      category: "face_wash",
      path: `${basePath}/cleansing-and-exfoliation/face-wash`,
      icon: FaceWashIcon,
      description:
        "Refreshing daily wash for soft and healthy-looking skin tone.",
    },
    {
      id: 3,
      level: 3,
      label: "Exfoliator & Scrub",
      category: "exfoliator_and_scrub",
      path: `${basePath}/cleansing-and-exfoliation/exfoliator-and-scrub`,
      icon: ExfoliatorIcon,
      description: "Removes dead skin cells to reveal a fresh and smooth glow.",
    },
    {
      id: 4,
      level: 3,
      label: "Sunscreen",
      category: "sunscreen",
      path: `${basePath}/cleansing-and-exfoliation/sunscreen`,
      icon: SunscreenIcon,
      description: "Shields skin from harmful UV rays and sun damage daily.",
    },
  ],
};

export const natures_blend: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Nature's Blend",
  category: "natures_blend",
  path: `${basePath}/natures-blend`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Aquaholic",
      category: "aquaholic",
      path: `${basePath}/natures-blend/aquaholic`,
      icon: AquaholicIcon,
      description: "Hydration-rich formulas to deeply quench dry, dull skin.",
    },
    {
      id: 2,
      level: 3,
      label: "Coffee Culture",
      category: "coffee_culture",
      path: `${basePath}/natures-blend/coffee-culture`,
      icon: CoffeeCultureIcon,
      description:
        "Energizing coffee extracts for a firm, smooth, youthful feel.",
    },
    {
      id: 3,
      level: 3,
      label: "Citrus Got Real",
      category: "citrus_got_real",
      path: `${basePath}/natures-blend/citrus-got-real`,
      icon: CitrusIcon,
      description:
        "Vitamin C boost for brighter, fresher, healthier-looking skin.",
    },
    {
      id: 4,
      level: 3,
      label: "View All",
      category: "view_all",
      path: `${basePath}/natures-blend/view-all`,
      icon: AllIcon,
      description:
        "Explore all skincare essentials, perfectly tailored for you.",
    },
  ],
};

export const face_mask: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Face Mask",
  category: "face_mask",
  path: `${basePath}/face-mask`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Sheet Mask",
      category: "sheet_mask",
      path: `${basePath}/face-mask/sheet-mask`,
      icon: SheetMaskIcon,
      description:
        "Instant hydration and glowing effect in just a few minutes.",
    },
    {
      id: 2,
      level: 3,
      label: "Face Pack",
      category: "face_pack",
      path: `${basePath}/face-mask/face-pack`,
      icon: FacePackIcon,
      description:
        "Detox and refresh your skin naturally with herbal extracts.",
    },
    {
      id: 3,
      level: 3,
      label: "View All",
      category: "view_all",
      path: `${basePath}/face-mask/view-all`,
      icon: AllIcon,
      description:
        "Browse all skincare must-haves for a flawless glowing look.",
    },
  ],
};

export const highlightedSkinOptions: string[] = [
  "serum",
  "sunscreen",
  "aquaholic",
  "face_pack",
];
