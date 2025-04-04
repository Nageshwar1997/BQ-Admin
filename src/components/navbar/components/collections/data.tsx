import { LevelTwoCategoryType } from "../../types";

const basePath = "/collections";

export const bath_and_body: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Bath & Body",
  category: "bath_and_body",
  path: `${basePath}/bath-and-body`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Shower Gel",
      category: "shower_gel",
      path: `${basePath}/bath-and-body/shower-gel`,
      description:
        "Refreshing shower gel that cleanses and hydrates for soft skin.",
    },
    {
      id: 2,
      level: 3,
      label: "Soap",
      category: "soap",
      path: `${basePath}/bath-and-body/soap`,
      description:
        "Gentle soap for daily cleansing, leaving skin fresh and nourished.",
    },
    {
      id: 3,
      level: 3,
      label: "Body Lotion",
      category: "body_lotion",
      path: `${basePath}/bath-and-body/body-lotion`,
      description:
        "Moisturizing body lotion that keeps skin smooth and hydrated all day.",
    },
    {
      id: 4,
      level: 3,
      label: "Body Spray",
      category: "body_spray",
      path: `${basePath}/bath-and-body/body-spray`,
      description:
        "Light body spray with a refreshing fragrance for all-day freshness.",
    },
    {
      id: 5,
      level: 3,
      label: "Hand Wash",
      category: "hand_wash",
      path: `${basePath}/bath-and-body/hand-wash`,
      description:
        "Cleansing hand wash that leaves hands soft and hygienically clean.",
    },
    {
      id: 6,
      level: 3,
      label: "Foot Cream",
      category: "foot_cream",
      path: `${basePath}/bath-and-body/foot-cream`,
      description:
        "Nourishing foot cream that soothes and softens tired, dry feet.",
    },
    {
      id: 7,
      level: 3,
      label: "Hand Cream",
      category: "hand_cream",
      path: `${basePath}/bath-and-body/hand-cream`,
      description:
        "Hydrating hand cream for soft, smooth hands with lasting moisture.",
    },
  ],
};

export const sugar_pop: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Sugar Pop",
  category: "sugar_pop",
  path: `${basePath}/sugar-pop`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lips",
      category: "lips",
      path: `${basePath}/sugar-pop/lips`,
      description:
        "Lip products for bold, vibrant color and deep nourishing moisture.",
    },
    {
      id: 2,
      level: 3,
      label: "Eyes",
      category: "eyes",
      path: `${basePath}/sugar-pop/eyes`,
      description:
        "Eye makeup essentials for creating stunning looks that last all day.",
    },
    {
      id: 3,
      level: 3,
      label: "Face",
      category: "face",
      path: `${basePath}/sugar-pop/face`,
      description:
        "Face products to enhance complexion with flawless coverage.",
    },
    {
      id: 4,
      level: 3,
      label: "Nails",
      category: "nails",
      path: `${basePath}/sugar-pop/nails`,
      description:
        "Vibrant nail colors and effective treatments for stylish, healthy nails.",
    },
    {
      id: 5,
      level: 3,
      label: "Skincare",
      category: "skincare",
      path: `${basePath}/sugar-pop/skincare`,
      description:
        "Skincare essentials for a radiant, nourished, and clear complexion.",
    },
    {
      id: 6,
      level: 3,
      label: "Body Care",
      category: "body_care",
      path: `${basePath}/sugar-pop/body-care`,
      description:
        "Body care products for soft, smooth skin with lasting hydration.",
    },
    {
      id: 7,
      level: 3,
      label: "Best of Sugar Pop",
      category: "best_of_sugar_pop",
      path: `${basePath}/sugar-pop/best-of-sugar-pop`,
      description:
        "Top-rated Sugar Pop products loved for their quality and results.",
    },
  ],
};

export const hair_care: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Hair Care",
  category: "hair_care",
  path: `${basePath}/hair-care`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Shampoo",
      category: "shampoo",
      path: `${basePath}/hair-care/shampoo`,
      description:
        "Cleansing shampoo that effectively revitalizes hair for healthy shine.",
    },
    {
      id: 2,
      level: 3,
      label: "Conditioner",
      category: "conditioner",
      path: `${basePath}/hair-care/conditioner`,
      description:
        "Nourishing conditioner that detangles and softens hair beautifully.",
    },
    {
      id: 3,
      level: 3,
      label: "Hair Oil",
      category: "hair_oil",
      path: `${basePath}/hair-care/hair-oil`,
      description:
        "Hair oil that deeply nourishes hair for strong, shiny, healthy hair.",
    },
    {
      id: 4,
      level: 3,
      label: "Serum",
      category: "serum",
      path: `${basePath}/hair-care/serum`,
      description:
        "Lightweight hair serum for frizz control and a silky, smooth finish.",
    },
    {
      id: 5,
      level: 3,
      label: "Hair Mask",
      category: "hair_mask",
      path: `${basePath}/hair-care/hair-mask`,
      description:
        "Deep conditioning hair mask for intense repair and hydration.",
    },
    {
      id: 6,
      level: 3,
      label: "Combo",
      category: "combo",
      path: `${basePath}/hair-care/combo`,
      description:
        "Value packs of hair care products for a complete hair routine.",
    },
    {
      id: 7,
      level: 3,
      label: "View All",
      category: "view_all",
      path: `${basePath}/hair-care/view-all`,
      description:
        "Browse all hair care products for your perfect hair solution.",
    },
  ],
};

export const gifting: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Gifting",
  category: "gifting",
  path: `${basePath}/gifting`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Lipstick Set",
      category: "lipstick_set",
      path: `${basePath}/gifting/lipstick-set`,
      description:
        "Beautiful lipstick sets perfect for gifting on any special occasion.",
    },
    {
      id: 2,
      level: 3,
      label: "Sugar Merch",
      category: "sugar_merch",
      path: `${basePath}/gifting/sugar-merch`,
      description:
        "Trendy Sugar-branded merchandise for fans and beauty lovers.",
    },
    {
      id: 3,
      level: 3,
      label: "Value Set",
      category: "value_set",
      path: `${basePath}/gifting/value-set`,
      description:
        "Curated value sets for a complete beauty experience and savings.",
    },
    {
      id: 4,
      level: 3,
      label: "Makeup Kit",
      category: "makeup_kit",
      path: `${basePath}/gifting/makeup-kit`,
      description:
        "Comprehensive makeup kits with essentials for a flawless look.",
    },
    {
      id: 5,
      level: 3,
      label: "Corporate Gifting",
      category: "corporate_gifting",
      path: `${basePath}/gifting/corporate-gifting`,
      description:
        "Elegant corporate gifts to leave a lasting impression with style.",
    },
    {
      id: 6,
      level: 3,
      label: "Sugar Set",
      category: "sugar_set",
      path: `${basePath}/gifting/sugar-set`,
      description:
        "Exclusive Sugar sets curated for beauty enthusiasts and gifting.",
    },
  ],
};
