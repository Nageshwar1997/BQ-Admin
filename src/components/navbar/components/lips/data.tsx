import { LevelTwoCategoryType } from "../../types";
import {
  TransferLipstickIcon,
  MatteLipstickIcon,
  LiquidLipstickIcon,
  PowderLipstickIcon,
  CrayonLipstickIcon,
  SatinLipstickIcon,
  BulletLipstickIcon,
  LipGlossIcon,
  HiShineLipstickIcon,
  LipLinerIcon,
  LipGlitterIcon,
  LipTintAndSatinIcon,
  AllIcon,
  LipPrimerIcon,
  LipstickRemoverIcon,
  LipBalmIcon,
  TintedLipBalmIcon,
  LipstickSetIcon,
  LipstickComboIcon,
  LipPaletteIcon,
  WaterproofLipstickIcon,
  SmudgeProofLipstickIcon,
} from "../icons";

const basePath = "/lips";

export const finish_types: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Finish Types",
  category: "finish_types",
  path: `${basePath}/finish-types`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Matte Lipstick",
      category: "matte_lipstick",
      path: `${basePath}/finish-types/matte-lipstick`,
      icon: MatteLipstickIcon,
      description:
        "Velvety matte finish with long-lasting, intense color payoff everywhere.",
    },
    {
      id: 2,
      level: 3,
      label: "Satin Lipstick",
      category: "satin_lipstick",
      path: `${basePath}/finish-types/satin-lipstick`,
      icon: SatinLipstickIcon,
      description:
        "Smooth, creamy texture with a luminous, semi-matte finish always.",
    },
    {
      id: 3,
      level: 3,
      label: "Hi-Shine Lipstick",
      category: "hi_shine_lipstick",
      path: `${basePath}/finish-types/hi-shine-lipstick`,
      icon: HiShineLipstickIcon,
      description:
        "Glossy finish for a shiny, luscious look with rich pigment beautifully.",
    },
    {
      id: 4,
      level: 3,
      label: "Lip Gloss",
      category: "lip_gloss",
      path: `${basePath}/finish-types/lip-gloss`,
      icon: LipGlossIcon,
      description:
        "Sheer to medium coverage with a high-shine, glossy finish flawlessly.",
    },
  ],
};

export const lipstick_forms: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Lipstick Forms",
  category: "lipstick_forms",
  path: `${basePath}/lipstick-forms`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Liquid Lipstick",
      category: "liquid_lipstick",
      path: `${basePath}/lipstick-forms/liquid-lipstick`,
      icon: LiquidLipstickIcon,
      description:
        "Rich, long-lasting color with a lightweight, matte finish beautifully.",
    },
    {
      id: 2,
      level: 3,
      label: "Powder Lipstick",
      category: "powder_lipstick",
      path: `${basePath}/lipstick-forms/powder-lipstick`,
      icon: PowderLipstickIcon,
      description:
        "Weightless powder formula with a soft-focus, matte effect perfectly.",
    },
    {
      id: 3,
      level: 3,
      label: "Crayon Lipstick",
      category: "crayon_lipstick",
      path: `${basePath}/lipstick-forms/crayon-lipstick`,
      icon: CrayonLipstickIcon,
      description:
        "Easy-to-apply crayon for precise lines and bold color payoff smoothly.",
    },
    {
      id: 4,
      level: 3,
      label: "Bullet Lipstick",
      category: "bullet_lipstick",
      path: `${basePath}/lipstick-forms/bullet-lipstick`,
      icon: BulletLipstickIcon,
      description:
        "Classic bullet shape with smooth, creamy, full-coverage color always.",
    },
  ],
};

export const long_lasting_lipsticks: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Long-Lasting Lipsticks",
  category: "long_lasting_lipsticks",
  path: `${basePath}/long-lasting-lipsticks`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Transfer Proof Lipstick",
      category: "transfer_proof_lipstick",
      path: `${basePath}/long-lasting-lipsticks/transfer-proof-lipstick`,
      icon: TransferLipstickIcon,
      description:
        "Stays put all day without smudging or fading for long-lasting wear.",
    },
    {
      id: 2,
      level: 3,
      label: "Water Proof Lipstick",
      category: "water_proof_lipstick",
      path: `${basePath}/long-lasting-lipsticks/water-proof-lipstick`,
      icon: WaterproofLipstickIcon,
      description:
        "Resistant to water and sweat, ensuring color stays vibrant always.",
    },
    {
      id: 3,
      level: 3,
      label: "Lip Tint & Stain",
      category: "lip_tint_and_stain",
      path: `${basePath}/long-lasting-lipsticks/lip-tint-and-stain`,
      icon: LipTintAndSatinIcon,
      description:
        "Lightweight tint with a natural finish that lasts for hours smoothly.",
    },
    {
      id: 4,
      level: 3,
      label: "Smudge Proof",
      category: "smudge_proof_lipstick",
      path: `${basePath}/long-lasting-lipsticks/smudge-proof-lipstick`,
      icon: SmudgeProofLipstickIcon,
      description:
        "No smudging or transferring, providing a flawless look perfectly.",
    },
  ],
};

export const lip_care: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Lip Care",
  category: "lip_care",
  path: `${basePath}/lip-care`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lip Primer & Scrub",
      category: "lip_primer_and_scrub",
      path: `${basePath}/lip-care/lip-primer-and-scrub`,
      icon: LipPrimerIcon,
      description:
        "Preps lips for smooth application and enhances color beautifully.",
    },
    {
      id: 2,
      level: 3,
      label: "Lipstick Fixer & Remover",
      category: "lipstick_fixer_and_remover",
      path: `${basePath}/lip-care/lipstick-fixer-and-remover`,
      icon: LipstickRemoverIcon,
      description:
        "Ensures long wear and easy removal without residue effortlessly.",
    },
    {
      id: 3,
      level: 3,
      label: "Lip Balm",
      category: "lip_balm",
      path: `${basePath}/lip-care/lip-balm`,
      icon: LipBalmIcon,
      description:
        "Deeply hydrates and protects lips from dryness and cracking.",
    },
    {
      id: 4,
      level: 3,
      label: "Tinted Lip Balm",
      category: "tinted_lip_balm",
      path: `${basePath}/lip-care/tinted-lip-balm`,
      icon: TintedLipBalmIcon,
      description:
        "Hydration with a hint of color for a natural, radiant look daily.",
    },
  ],
};

export const lip_enhancers_and_other: LevelTwoCategoryType = {
  id: 5,
  level: 2,
  label: "Lip Enhancers & Other",
  category: "lip_enhancers_and_other",
  path: `${basePath}/lip-enhancers-and-other`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lip Liner",
      category: "lip_liner",
      path: `${basePath}/lip-enhancers-and-other/lip-liner`,
      icon: LipLinerIcon,
      description:
        "Defines lips with precision, shaping and preventing feathering daily.",
    },
    {
      id: 2,
      level: 3,
      label: "Lip Glitter",
      category: "lip_glitter",
      path: `${basePath}/lip-enhancers-and-other/lip-glitter`,
      icon: LipGlitterIcon,
      description:
        "Adds sparkle and shine for a glamorous, bold look on special occasions.",
    },
    {
      id: 3,
      level: 3,
      label: "View All",
      category: "view_all",
      path: `${basePath}/lip-enhancers-and-other/view-all`,
      icon: AllIcon,
      description:
        "Explore the complete range of lip products for every need beautifully.",
    },
  ],
};

export const lipstick_sets_and_combos: LevelTwoCategoryType = {
  id: 6,
  level: 2,
  label: "Lipstick Set & Combo",
  category: "lipstick_set_and_combo",
  path: `${basePath}/lipstick-set-and-combo`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lipstick Set",
      category: "lipstick_set",
      path: `${basePath}/lipstick-set-and-combo/lipstick-set`,
      icon: LipstickSetIcon,
      description:
        "Multiple shades in one set for versatile, everyday looks beautifully.",
    },
    {
      id: 2,
      level: 3,
      label: "Lipstick Combo",
      category: "lipstick_combo",
      path: `${basePath}/lipstick-set-and-combo/lipstick-combo`,
      icon: LipstickComboIcon,
      description:
        "Perfectly paired lip products for a complete, cohesive look always.",
    },
    {
      id: 3,
      level: 3,
      label: "Lip Palette",
      category: "lip_palette",
      path: `${basePath}/lipstick-set-and-combo/lip-palette`,
      icon: LipPaletteIcon,
      description:
        "Versatile palette with various shades for creative, bold looks daily.",
    },
  ],
};

export const highlightedLipsOptions = [
  "lip_gloss",
  "liquid_lipstick",
  "lip_tint_and_stain",
  "lipstick_fixer_and_remover",
  "lip_glitter",
  "lip_palette",
];
