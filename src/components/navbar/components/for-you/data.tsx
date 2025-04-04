import { LevelTwoCategoryType, SocialCommunityItem } from "../../types";

const basePath = "/for_you";
const levelTwoCategoryPath = {
  new: `${basePath}/new`,
  sugar_play: `${basePath}/sugar_play`,
  offers: `/offers`,
  blogs: `/blogs`,
};

export const new_new: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  heading: "Latest Trends",
  label: "New",
  category: "new",
  path: levelTwoCategoryPath.new,
  videoUrl:
    "https://res.cloudinary.com/drbhw0nwt/video/upload/sp_auto/v1739693059/videos/wvq939qkdpzgchfpzk2m.m3u8",
  thumbnail:
    "https://www.cosmeticsdesign-asia.com/resizer/v2/DFI3RWMPJJMNBF3E6P4SBJ7HZQ.jpg?auth=474f1eceade4c82457720b986e47fa3a6aea0ea968cc8fa505b74d50fd0353c1&width=1802&height=1013&smart=true",
  description: "Discover new beauty arrivals for a fresh, trendy style.",
  subCategories: [
    {
      id: 1,
      level: 3,
      path: "",
      label: "",
      category: "",
      description: "",
    },
  ],
};

export const sugar_play: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  heading: "Best Sellers",
  label: "Sugar Play",
  category: "sugar_play",
  path: levelTwoCategoryPath.sugar_play,
  videoUrl:
    "https://res.cloudinary.com/drbhw0nwt/video/upload/sp_auto/v1739693059/videos/wvq939qkdpzgchfpzk2m.m3u8",
  description: "Shop beauty products top-rated & loved by enthusiasts.",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "",
      path: "",
      category: "",
      description: "",
    },
  ],
};

export const offers: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  heading: "Exclusive Deals",
  label: "Offers",
  category: "offers",
  path: levelTwoCategoryPath.offers,
  videoUrl:
    "https://res.cloudinary.com/drbhw0nwt/video/upload/sp_auto/v1739693059/videos/wvq939qkdpzgchfpzk2m.m3u8",
  description: "Grab discounts on premium cosmetics for a limited time.",
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "",
      path: "",
      category: "",
      description: "",
    },
  ],
};

export const blogs: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  heading: "Beauty Insights",
  label: "Blogs",
  category: "blogs",
  path: levelTwoCategoryPath.blogs,
  videoUrl:
    "https://res.cloudinary.com/drbhw0nwt/video/upload/sp_auto/v1739693059/videos/wvq939qkdpzgchfpzk2m.m3u8",
  description: "Explore top beauty tips, trends, & skincare routines.",
  subCategories: [
    {
      id: 1,
      level: 3,
      path: "",
      label: "",
      category: "",
      description: "",
    },
  ],
};

export const socialCommunity: SocialCommunityItem[] = [
  {
    id: 1,
    label: "Founder's Story: Watch Now",
    link: "https://www.youtube.com/watch?v=92kcChL74ZE",
  },
  {
    id: 2,
    label: "Chat with our team",
    link: "/contact-us",
  },
];
