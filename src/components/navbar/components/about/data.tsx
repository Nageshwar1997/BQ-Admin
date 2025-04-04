import { LevelTwoCategoryType } from "../../types";

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
      description:
        "Learn about our journey, mission, and values that define our brand.",
    },
    {
      id: 2,
      level: 3,
      label: "Mission Vision Values",
      category: "mission_vision_values",
      path: `${basePath}/company/mission_vision_values`,
      description:
        "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      id: 3,
      level: 3,
      label: "Team",
      category: "team",
      path: `${basePath}/company/team`,
      description:
        "Meet our talented team committed to delivering excellence every day.",
    },
    {
      id: 4,
      level: 3,
      label: "Contact Us",
      category: "contact_us",
      path: `${basePath}/company/contact_us`,
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
      description:
        "Stay updated with our latest news, events, and media announcements.",
    },
    {
      id: 2,
      level: 3,
      label: "Awards",
      category: "awards",
      path: `${basePath}/press/awards`,
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
      description:
        "Experience our vibrant culture driven by values of growth and innovation.",
    },
    {
      id: 2,
      level: 3,
      label: "Openings",
      category: "openings",
      path: `${basePath}/careers/openings`,
      description:
        "Discover exciting career opportunities and join our dynamic team today.",
    },
    {
      id: 3,
      level: 3,
      label: "Retail/E-Commerce",
      category: "retail_e_commerce",
      path: `${basePath}/careers/retail-e-commerce`,
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
      description:
        "Understand our compliance standards ensuring trust and transparency.",
    },
    {
      id: 2,
      level: 3,
      label: "Privacy/Policy",
      category: "privacy_policy",
      path: `${basePath}/trust-center-and-legal/privacy-policy`,
      description:
        "Learn about our privacy practices and data protection commitments.",
    },
    {
      id: 3,
      level: 3,
      label: "Terms & Conditions",
      category: "terms_and_conditions",
      path: `${basePath}/trust-center-and-legal/terms-and-conditions`,
      description:
        "Review our terms and conditions for using our products and services.",
    },
  ],
};
