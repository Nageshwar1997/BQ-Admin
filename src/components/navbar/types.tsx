export interface SocialCommunityItem {
  id: number;
  label: string;
  link: string;
}

export interface LevelOneCategoryType {
  id: number;
  path: string;
  level: number;
  label: string;
  category: string;
  subCategories: LevelTwoCategoryType[];
}

export interface LevelTwoCategoryType {
  id: number;
  path: string;
  level: number;
  label: string;
  category: string;
  subCategories: LevelThreeCategoryType[];
  heading?: string;
  videoUrl?: string;
  thumbnail?: string;
  description?: string;
}

export interface LevelThreeCategoryType {
  id: number;
  path: string;
  level: number;
  label: string;
  category: string;
  description: string;
}

export interface Testimonial {
  id: number;
  content: string;
  name: string;
  role: string;
  image: string;
}
