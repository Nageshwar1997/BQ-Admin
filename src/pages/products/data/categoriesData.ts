import {
  LevelTwoCategoryType,
  LevelOneCategoryType,
  ProductType,
} from "../../../types";

/* ============= For You Start ============= */
const new_new: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "New",
  value: "new",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "New Arrivals",
      value: "new_arrivals",
    },
  ],
};

const sugar_play: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Sugar Play",
  value: "sugar_play",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Sugar Play",
      value: "sugar_play",
    },
  ],
};

/* ============= For You End ============= */

/* ============= Lips Start ============= */
const finish_types: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Finish Types",
  value: "finish_types",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Matte Lipstick",
      value: "matte_lipstick",
    },
    {
      id: 2,
      level: 3,
      label: "Satin Lipstick",
      value: "satin_lipstick",
    },
    {
      id: 3,
      level: 3,
      label: "Hi-Shine Lipstick",
      value: "hi_shine_lipstick",
    },
    {
      id: 4,
      level: 3,
      label: "Lip Gloss",
      value: "lip_gloss",
    },
  ],
};

const lipstick_forms: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Lipstick Forms",
  value: "lipstick_forms",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Liquid Lipstick",
      value: "liquid_lipstick",
    },
    {
      id: 2,
      level: 3,
      label: "Powder Lipstick",
      value: "powder_lipstick",
    },
    {
      id: 3,
      level: 3,
      label: "Crayon Lipstick",
      value: "crayon_lipstick",
    },
    {
      id: 4,
      level: 3,
      label: "Bullet Lipstick",
      value: "bullet_lipstick",
    },
  ],
};

const long_lasting_lipsticks: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Long-Lasting Lipsticks",
  value: "long_lasting_lipsticks",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Transfer Proof Lipstick",
      value: "transfer_proof_lipstick",
    },
    {
      id: 2,
      level: 3,
      label: "Water Proof Lipstick",
      value: "water_proof_lipstick",
    },
    {
      id: 3,
      level: 3,
      label: "Lip Tint & Stain",
      value: "lip_tint_and_stain",
    },
    {
      id: 4,
      level: 3,
      label: "Smudge Proof",
      value: "smudge_proof_lipstick",
    },
  ],
};

const lip_care: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Lip Care",
  value: "lip_care",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lip Primer & Scrub",
      value: "lip_primer_and_scrub",
    },
    {
      id: 2,
      level: 3,
      label: "Lipstick Fixer & Remover",
      value: "lipstick_fixer_and_remover",
    },
    {
      id: 3,
      level: 3,
      label: "Lip Balm",
      value: "lip_balm",
    },
    {
      id: 4,
      level: 3,
      label: "Tinted Lip Balm",
      value: "tinted_lip_balm",
    },
  ],
};

const lip_enhancers_and_other: LevelTwoCategoryType = {
  id: 5,
  level: 2,
  label: "Lip Enhancers & Other",
  value: "lip_enhancers_and_other",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lip Liner",
      value: "lip_liner",
    },
    {
      id: 2,
      level: 3,
      label: "Lip Glitter",
      value: "lip_glitter",
    },
    {
      id: 3,
      level: 3,
      label: "View All",
      value: "view_all",
    },
  ],
};

const lipstick_sets_and_combos: LevelTwoCategoryType = {
  id: 6,
  level: 2,
  label: "Lipstick Set & Combo",
  value: "lipstick_set_and_combo",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lipstick Set",
      value: "lipstick_set",
    },
    {
      id: 2,
      level: 3,
      label: "Lipstick Combo",
      value: "lipstick_combo",
    },
    {
      id: 3,
      level: 3,
      label: "Lip Palette",
      value: "lip_palette",
    },
  ],
};
/* ============= Lips End ============= */

/* ============= Eyes Start ============= */

const kohl_and_kajal: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Kohl & Kajal",
  value: "kohl_and_kajal",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Kohl",
      value: "kohl",
    },
    {
      id: 2,
      level: 3,
      label: "Kajal",
      value: "kajal",
    },
    {
      id: 3,
      level: 3,
      label: "Smudge Proof Kajal",
      value: "smudge_proof_kajal",
    },
  ],
};

const mascaras: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Mascaras",
  value: "mascaras",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Volumizing Mascara",
      value: "volumizing_mascara",
    },
    {
      id: 2,
      level: 3,
      label: "Curl Lengthening Mascara",
      value: "curl_lengthening_mascara",
    },
    {
      id: 3,
      level: 3,
      label: "Waterproof Mascara",
      value: "waterproof_mascara",
    },
  ],
};

const eyeliners: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Eyeliners",
  value: "eyeliners",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Liquid Eyeliner",
      value: "liquid_eyeliner",
    },
    {
      id: 2,
      level: 3,
      label: "Gel Eyeliner",
      value: "gel_eyeliner",
    },
    {
      id: 3,
      level: 3,
      label: "Pen Eyeliner",
      value: "pen_eyeliner",
    },
  ],
};

const eyeshadow: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Eyeshadow",
  value: "eyeshadow",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Eyeshadow Palette",
      value: "eyeshadow_palette",
    },
    {
      id: 2,
      level: 3,
      label: "Liquid Eyeshadow",
      value: "liquid_eyeshadow",
    },
    {
      id: 3,
      level: 3,
      label: "Glitter Eyeshadow",
      value: "glitter_eyeshadow",
    },
  ],
};

const eyebrows: LevelTwoCategoryType = {
  id: 5,
  level: 2,
  label: "Eyebrows",
  value: "eyebrows",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Brow Definer",
      value: "brow_definer",
    },
    {
      id: 2,
      level: 3,
      label: "Brow Pencil",
      value: "brow_pencil",
    },
    {
      id: 3,
      level: 3,
      label: "Brow Gel",
      value: "brow_gel",
    },
  ],
};

const eye_value_set: LevelTwoCategoryType = {
  id: 6,
  level: 2,
  label: "Eye Value Set",
  value: "eye_value_set",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Eyelashes",
      value: "eyelashes",
    },
    {
      id: 2,
      level: 3,
      label: "Eye Gift Set",
      value: "eye_gift_set",
    },
    {
      id: 3,
      level: 3,
      label: "Eye Combo",
      value: "eye_combo",
    },
  ],
};

/* ============= Eyes End ============= */

/* ============= Face Start ============= */
const face_makeup: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Face Makeup",
  value: "face_makeup",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Foundation",
      value: "foundation",
    },
    {
      id: 2,
      level: 3,
      label: "BB Cream",
      value: "bb_cream",
    },
    {
      id: 3,
      level: 3,
      label: "Compact Powder",
      value: "compact_powder",
    },
    {
      id: 4,
      level: 3,
      label: "Loose Powder",
      value: "loose_powder",
    },
    {
      id: 5,
      level: 3,
      label: "Banana Powder",
      value: "banana_powder",
    },
    {
      id: 6,
      level: 3,
      label: "SPF Foundation",
      value: "spf_foundation",
    },
  ],
};

const traditional_and_essentials: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Traditional & Essentials",
  value: "traditional_and_essentials",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Sindoor",
      value: "sindoor",
    },
  ],
};

const cheeks_and_glow: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Cheeks & Glow",
  value: "cheeks_and_glow",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Highlighter",
      value: "highlighter",
    },
    {
      id: 2,
      level: 3,
      label: "Liquid Highlighter",
      value: "liquid_highlighter",
    },
    {
      id: 3,
      level: 3,
      label: "Blush",
      value: "blush",
    },
    {
      id: 4,
      level: 3,
      label: "Cheek Stain",
      value: "cheek_stain",
    },
  ],
};

const setting_and_finishing: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Setting & Finishing",
  value: "setting_and_finishing",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Setting Spray",
      value: "setting_spray",
    },
    {
      id: 2,
      level: 3,
      label: "Compact",
      value: "compact",
    },
    {
      id: 3,
      level: 3,
      label: "Fixer",
      value: "fixer",
    },
  ],
};

const foundations_by_finish: LevelTwoCategoryType = {
  id: 5,
  level: 2,
  label: "Foundations by Finish",
  value: "foundations_by_finish",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Liquid Foundation",
      value: "liquid_foundation",
    },
    {
      id: 2,
      level: 3,
      label: "Matte Foundation",
      value: "matte_foundation",
    },
    {
      id: 3,
      level: 3,
      label: "Water Resistant Foundation",
      value: "water_resistant_foundation",
    },
    {
      id: 4,
      level: 3,
      label: "High Coverage Foundation",
      value: "high_coverage_foundation",
    },
    {
      id: 5,
      level: 3,
      label: "Stick Foundation",
      value: "stick_foundation",
    },
  ],
};

const foundations_by_skin_type: LevelTwoCategoryType = {
  id: 6,
  level: 2,
  label: "Foundations by Skin Type",
  value: "foundations_by_skin_type",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Best for Dry Skin",
      value: "best_for_dry_skin",
    },
    {
      id: 2,
      level: 3,
      label: "Best for Oily Skin",
      value: "best_for_oily_skin",
    },
  ],
};

const primers_and_removers: LevelTwoCategoryType = {
  id: 7,
  level: 2,
  label: "Primers & Removers",
  value: "primers_and_removers",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Makeup Remover",
      value: "makeup_remover",
    },
    {
      id: 2,
      level: 3,
      label: "Primer",
      value: "primer",
    },
  ],
};

const bronzers_and_contours: LevelTwoCategoryType = {
  id: 8,
  level: 2,
  label: "Bronzers & Contours",
  value: "bronzers_and_contours",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Bronzer",
      value: "bronzer",
    },
    {
      id: 2,
      level: 3,
      label: "Contour",
      value: "contour",
    },
  ],
};

const concealers_and_correctors: LevelTwoCategoryType = {
  id: 9,
  level: 2,
  label: "Concealers & Correctors",
  value: "concealers_and_correctors",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Color Concealer",
      value: "color_concealer",
    },
    {
      id: 2,
      level: 3,
      label: "Color Corrector",
      value: "color_corrector",
    },
  ],
};

/* ============= Face End ============= */

/* ============= Skin Start ============= */
const moisturizers: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Moisturizers",
  value: "moisturizers",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Night Cream",
      value: "night_cream",
    },
    {
      id: 2,
      level: 3,
      label: "Eye Cream",
      value: "eye_cream",
    },
    {
      id: 3,
      level: 3,
      label: "Serum",
      value: "serum",
    },
    {
      id: 4,
      level: 3,
      label: "Skincare Kit",
      value: "skincare_kit",
    },
  ],
};

const cleansing_and_exfoliation: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Cleansing & Exfoliation",
  value: "cleansing_and_exfoliation",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Cleanser",
      value: "cleanser",
    },
    {
      id: 2,
      level: 3,
      label: "Face Wash",
      value: "face_wash",
    },
    {
      id: 3,
      level: 3,
      label: "Exfoliator & Scrub",
      value: "exfoliator_and_scrub",
    },
    {
      id: 4,
      level: 3,
      label: "Sunscreen",
      value: "sunscreen",
    },
  ],
};

const natures_blend: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Nature's Blend",
  value: "natures_blend",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Aquaholic",
      value: "aquaholic",
    },
    {
      id: 2,
      level: 3,
      label: "Coffee Culture",
      value: "coffee_culture",
    },
    {
      id: 3,
      level: 3,
      label: "Citrus Got Real",
      value: "citrus_got_real",
    },
    {
      id: 4,
      level: 3,
      label: "View All",
      value: "view_all",
    },
  ],
};

const face_mask: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Face Mask",
  value: "face_mask",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Sheet Mask",
      value: "sheet_mask",
    },
    {
      id: 2,
      level: 3,
      label: "Face Pack",
      value: "face_pack",
    },
    {
      id: 3,
      level: 3,
      label: "View All",
      value: "view_all",
    },
  ],
};

/* ============= Skin End ============= */

/* ============= Collections Start ============= */
const bath_and_body: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Bath & Body",
  value: "bath_and_body",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Shower Gel",
      value: "shower_gel",
    },
    {
      id: 2,
      level: 3,
      label: "Soap",
      value: "soap",
    },
    {
      id: 3,
      level: 3,
      label: "Body Lotion",
      value: "body_lotion",
    },
    {
      id: 4,
      level: 3,
      label: "Body Spray",
      value: "body_spray",
    },
    {
      id: 5,
      level: 3,
      label: "Hand Wash",
      value: "hand_wash",
    },
    {
      id: 6,
      level: 3,
      label: "Foot Cream",
      value: "foot_cream",
    },
    {
      id: 7,
      level: 3,
      label: "Hand Cream",
      value: "hand_cream",
    },
  ],
};

const sugar_pop: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Sugar Pop",
  value: "sugar_pop",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lips",
      value: "lips",
    },
    {
      id: 2,
      level: 3,
      label: "Eyes",
      value: "eyes",
    },
    {
      id: 3,
      level: 3,
      label: "Face",
      value: "face",
    },
    {
      id: 4,
      level: 3,
      label: "Nails",
      value: "nails",
    },
    {
      id: 5,
      level: 3,
      label: "Skincare",
      value: "skincare",
    },
    {
      id: 6,
      level: 3,
      label: "Body Care",
      value: "body_care",
    },
    {
      id: 7,
      level: 3,
      label: "Best of Sugar Pop",
      value: "best_of_sugar_pop",
    },
  ],
};

const hair_care: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Hair Care",
  value: "hair_care",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Shampoo",
      value: "shampoo",
    },
    {
      id: 2,
      level: 3,
      label: "Conditioner",
      value: "conditioner",
    },
    {
      id: 3,
      level: 3,
      label: "Hair Oil",
      value: "hair_oil",
    },
    {
      id: 4,
      level: 3,
      label: "Serum",
      value: "serum",
    },
    {
      id: 5,
      level: 3,
      label: "Hair Mask",
      value: "hair_mask",
    },
    {
      id: 6,
      level: 3,
      label: "Combo",
      value: "combo",
    },
    {
      id: 7,
      level: 3,
      label: "View All",
      value: "view_all",
    },
  ],
};

const gifting: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Gifting",
  value: "gifting",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lipstick Set",
      value: "lipstick_set",
    },
    {
      id: 2,
      level: 3,
      label: "Sugar Merch",
      value: "sugar_merch",
    },
    {
      id: 3,
      level: 3,
      label: "Value Set",
      value: "value_set",
    },
    {
      id: 4,
      level: 3,
      label: "Makeup Kit",
      value: "makeup_kit",
    },
    {
      id: 5,
      level: 3,
      label: "Corporate Gifting",
      value: "corporate_gifting",
    },
    {
      id: 6,
      level: 3,
      label: "Sugar Set",
      value: "sugar_set",
    },
  ],
};

/* ============= Collections End ============= */

export const categoriesData: LevelOneCategoryType[] = [
  {
    id: 1,
    level: 1,
    label: "For You",
    value: "for_you",
    subCategories: [new_new, sugar_play], // only new is reserved keyword we can't use new
  },
  {
    id: 2,
    level: 1,
    label: "Lips",
    value: "lips",
    subCategories: [
      finish_types,
      lipstick_forms,
      long_lasting_lipsticks,
      lip_care,
      lip_enhancers_and_other,
      lipstick_sets_and_combos,
    ],
  },
  {
    id: 3,
    level: 1,
    label: "Eyes",
    value: "eyes",
    subCategories: [
      kohl_and_kajal,
      mascaras,
      eyeliners,
      eyeshadow,
      eyebrows,
      eye_value_set,
    ],
  },
  {
    id: 4,
    level: 1,
    label: "Face",
    value: "face",
    subCategories: [
      face_makeup,
      traditional_and_essentials,
      cheeks_and_glow,
      setting_and_finishing,
      primers_and_removers,
      bronzers_and_contours,
      concealers_and_correctors,
      foundations_by_skin_type,
      foundations_by_finish,
    ],
  },
  {
    id: 5,
    level: 1,
    label: "Skin",
    value: "skin",
    subCategories: [
      moisturizers,
      cleansing_and_exfoliation,
      natures_blend,
      face_mask,
    ],
  },
  {
    id: 6,
    level: 1,
    label: "Collections",
    value: "collections",
    subCategories: [bath_and_body, sugar_pop, hair_care, gifting],
  },
];

interface InputDataProps {
  name: keyof ProductType;
  label: string;
  placeholder: string;
}

export const INPUTS_DATA: InputDataProps[] = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter Product title",
  },
  {
    name: "brand",
    label: "Brand",
    placeholder: "Enter Product brand",
  },
];

export const PRICE_DATA: InputDataProps[] = [
  {
    name: "originalPrice",
    label: "Original Price",
    placeholder: "Enter Original Price",
  },
  {
    name: "sellingPrice",
    label: "Selling Price",
    placeholder: "Enter Selling Price",
  },
];

export const CATEGORY_DATA: InputDataProps[] = [
  {
    name: "categoryLevelOne",
    label: "Category One",
    placeholder: "Select a level one category",
  },
  {
    name: "categoryLevelTwo",
    label: "Category Two",
    placeholder: "Select a level two category",
  },
  {
    name: "categoryLevelThree",
    label: "Category Three",
    placeholder: "Select a level three category",
  },
];

export const QUILL_DATA: InputDataProps[] = [
  {
    name: "description",
    label: "Description",
    placeholder: "Write a description content of the product...",
  },
  {
    name: "howToUse",
    label: "How to use",
    placeholder: "Write a how to use content of the product...",
  },
  {
    name: "ingredients",
    label: "Ingredients",
    placeholder: "Write a ingredients content of the product...",
  },
  {
    name: "additionalDetails",
    label: "Additional Details",
    placeholder: "Write a additional details content of the product...",
  },
];
