import { LevelOneCategoryType } from "../types";
import {
  bronzers_and_contours,
  cheeks_and_glow,
  concealers_and_correctors,
  face_makeup,
  foundations_by_finish,
  foundations_by_skin_type,
  primers_and_removers,
  setting_and_finishing,
  traditional_and_essentials,
} from "../components/face/data";
import {
  eye_value_set,
  eyebrows,
  eyeliners,
  eyeshadow,
  kohl_and_kajal,
  mascaras,
} from "../components/eyes/data";
import {
  finish_types,
  lip_care,
  lip_enhancers_and_other,
  lipstick_forms,
  lipstick_sets_and_combos,
  long_lasting_lipsticks,
} from "../components/lips/data";
import { blogs, new_new, offers, sugar_play } from "../components/for-you/data";
import {
  moisturizers,
  cleansing_and_exfoliation,
  natures_blend,
  face_mask,
} from "../components/skin/data";
import {
  bath_and_body,
  gifting,
  hair_care,
  sugar_pop,
} from "../components/collections/data";
import {
  careers,
  company,
  press,
  trust_center,
} from "../components/about/data";

export const for_you: LevelOneCategoryType = {
  id: 1,
  level: 1,
  label: "For You",
  category: "for_you",
  path: "/for_you",
  subCategories: [
    new_new, // only new is reserved keyword we can't use new
    sugar_play,
    offers,
    blogs,
  ],
};

export const lips: LevelOneCategoryType = {
  id: 2,
  level: 1,
  label: "Lips",
  category: "lips",
  path: "/lips",
  subCategories: [
    finish_types,
    lipstick_forms,
    long_lasting_lipsticks,
    lip_care,
    lip_enhancers_and_other,
    lipstick_sets_and_combos,
  ],
};

export const eyes: LevelOneCategoryType = {
  id: 3,
  level: 1,
  label: "Eyes",
  category: "eyes",
  path: "/eyes",
  subCategories: [
    kohl_and_kajal,
    mascaras,
    eyeliners,
    eyeshadow,
    eyebrows,
    eye_value_set,
  ],
};

export const face: LevelOneCategoryType = {
  id: 4,
  level: 1,
  label: "Face",
  category: "face",
  path: "/face",
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
};

export const skin: LevelOneCategoryType = {
  id: 5,
  level: 1,
  label: "Skin",
  category: "skin",
  path: "/skin",
  subCategories: [
    moisturizers,
    cleansing_and_exfoliation,
    natures_blend,
    face_mask,
  ],
};

export const collections: LevelOneCategoryType = {
  id: 6,
  level: 1,
  label: "Collections",
  category: "collections",
  path: "/collections",
  subCategories: [bath_and_body, sugar_pop, hair_care, gifting],
};

export const about: LevelOneCategoryType = {
  id: 7,
  level: 1,
  label: "About",
  category: "about",
  path: "/about",
  subCategories: [company, careers, press, trust_center],
};

export const navbarCategoriesData: LevelOneCategoryType[] = [
  for_you,
  lips,
  eyes,
  face,
  skin,
  collections,
  about,
];
