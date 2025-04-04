import { LevelTwoCategoryType } from "../../types";
import {
  AboutUsIcon,
  AwardsIcon,
  ComplianceIcon,
  ContactUsIcon,
  MissionVisionValuesIcon,
  NewsRoomIcon,
  OpeningsIcon,
  PrivacyPolicyIcon,
  RetailECommerceIcon,
  TeamIcon,
  TermsAndConditionsIcon,
  ValuesAndCultureIcon,
} from "../icons";

const basePath = "/about";

export const company: LevelTwoCategoryType = {
  id: 1,
  level: 2,
  label: "Company",
  category: "company",
  path: `${basePath}/company`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "About Us",
      category: "about_us",
      path: `${basePath}/company/about_us`,
      icon: AboutUsIcon,
      description:
        "Learn about our journey, mission, and values that define our brand.",
    },
    {
      id: 2,
      level: 3,
      label: "Mission Vision Values",
      category: "mission_vision_values",
      path: `${basePath}/company/mission_vision_values`,
      icon: MissionVisionValuesIcon,
      description:
        "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      id: 3,
      level: 3,
      label: "Team",
      category: "team",
      path: `${basePath}/company/team`,
      icon: TeamIcon,
      description:
        "Meet our talented team committed to delivering excellence every day.",
    },
    {
      id: 4,
      level: 3,
      label: "Contact Us",
      category: "contact_us",
      path: `${basePath}/company/contact_us`,
      icon: ContactUsIcon,
      description:
        "Get in touch with us for inquiries, support, or collaboration opportunities.",
    },
  ],
};

export const press: LevelTwoCategoryType = {
  id: 2,
  level: 2,
  label: "Press",
  category: "press",
  path: `${basePath}/press`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Newsroom",
      category: "newsroom",
      path: `${basePath}/press/newsroom`,
      icon: NewsRoomIcon,
      description:
        "Stay updated with our latest news, events, and media announcements.",
    },
    {
      id: 2,
      level: 3,
      label: "Awards",
      category: "awards",
      path: `${basePath}/press/awards`,
      icon: AwardsIcon,
      description:
        "Explore the recognitions and awards we have received for excellence.",
    },
  ],
};

export const careers: LevelTwoCategoryType = {
  id: 3,
  level: 2,
  label: "Careers",
  category: "careers",
  path: `${basePath}/careers`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Values/Culture",
      category: "values_culture",
      path: `${basePath}/careers/values-culture`,
      icon: ValuesAndCultureIcon,
      description:
        "Experience our vibrant culture driven by values of growth and innovation.",
    },
    {
      id: 2,
      level: 3,
      label: "Openings",
      category: "openings",
      path: `${basePath}/careers/openings`,
      icon: OpeningsIcon,
      description:
        "Discover exciting career opportunities and join our dynamic team today.",
    },
    {
      id: 3,
      level: 3,
      label: "Retail/E-Commerce",
      category: "retail_e_commerce",
      path: `${basePath}/careers/retail-e-commerce`,
      icon: RetailECommerceIcon,
      description:
        "Explore roles in retail and e-commerce driving our digital success.",
    },
  ],
};

export const trust_center: LevelTwoCategoryType = {
  id: 4,
  level: 2,
  label: "Trust Center & Legal",
  category: "trust_center_and_legal",
  path: `${basePath}/trust-center-and-legal`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: "Compliance",
      category: "compliance",
      path: `${basePath}/trust-center-and-legal/compliance`,
      icon: ComplianceIcon,
      description:
        "Understand our compliance standards ensuring trust and transparency.",
    },
    {
      id: 2,
      level: 3,
      label: "Privacy/Policy",
      category: "privacy_policy",
      path: `${basePath}/trust-center-and-legal/privacy-policy`,
      icon: PrivacyPolicyIcon,
      description:
        "Learn about our privacy practices and data protection commitments.",
    },
    {
      id: 3,
      level: 3,
      label: "Terms & Conditions",
      category: "terms_and_conditions",
      path: `${basePath}/trust-center-and-legal/terms-and-conditions`,
      icon: TermsAndConditionsIcon,
      description:
        "Review our terms and conditions for using our products and services.",
    },
  ],
};

export const highlightedAboutOptions = [
  "mission_vision_values",
  "retail_e_commerce",
];

export const testimonials = [
  {
    id: 1,
    content:
      "I absolutely love the range of products on this website! The quality is unmatched, and my skin has never felt better. I always get compliments!",
    name: "Nageshwar Pawar",
    role: "Founder",
    image:
      "https://ctruhcdn.azureedge.net/main-webiste/public/images/navbar/krishna-gupta.webp",
  },
  {
    id: 2,
    content: `Finding the perfect shade was so easy. The product descriptions and customer reviews helped me make the right choice. Fast delivery too!`,
    name: "Manjusha Magar",
    role: "CEO",
    image:
      "https://ctruhcdn.azureedge.net/main-webiste/public/images/navbar/aarav-joshi.webp",
  },
  {
    id: 3,
    content: `I love how the products feel on my skin. They are lightweight, long-lasting, and make me feel confident all day. Highly recommended!`,
    name: "Sanket Pawar",
    role: "Manager",
    image:
      "https://ctruhcdn.azureedge.net/main-webiste/public/images/navbar/lucas-smith.webp",
  },
];
