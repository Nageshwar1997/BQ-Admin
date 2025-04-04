import { IconType } from "../types";

export type IconProps = {
  className?: string;
  onClick?: () => void;
};

export const SunIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MoonIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M21.9548 12.9566C20.5779 15.3719 17.9791 17.0003 15 17.0003C10.5817 17.0003 7 13.4186 7 9.00033C7 6.02096 8.62867 3.42199 11.0443 2.04517C5.96975 2.52631 2 6.79961 2 12.0001C2 17.5229 6.47715 22.0001 12 22.0001C17.2002 22.0001 21.4733 18.0308 21.9548 12.9566Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-w-[18px] h-[18px] fill-red ${className}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="black"
  >
    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" />
  </svg>
);

export const CheckMark = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-w-[18px] h-[18px] ${className}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#26272A"
  >
    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z" />
  </svg>
);

export const CameraIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#1A1A1A"
    className={className}
  >
    <path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l50-54q11-12 26.5-19t32.5-7h165q17 0 28.5 11.5T560-800q0 17-11.5 28.5T520-760H355l-73 80H120v480h640v-320q0-17 11.5-28.5T800-560q17 0 28.5 11.5T840-520v320q0 33-23.5 56.5T760-120H120Zm640-640h-40q-17 0-28.5-11.5T680-800q0-17 11.5-28.5T720-840h40v-40q0-17 11.5-28.5T800-920q17 0 28.5 11.5T840-880v40h40q17 0 28.5 11.5T920-800q0 17-11.5 28.5T880-760h-40v40q0 17-11.5 28.5T800-680q-17 0-28.5-11.5T760-720v-40ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z" />
  </svg>
);

export const EyeOffIcon = ({ className, onClick }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#e8eaed"
    className={className}
    onClick={onClick}
  >
    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
  </svg>
);

export const EyeIcon = ({ className, onClick }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#e8eaed"
    className={className}
    onClick={onClick}
  >
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
  </svg>
);

export const DropdownIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M5.91669 7.5L9.91076 11.4941C10.2362 11.8195 10.7638 11.8195 11.0893 11.4941L15.0834 7.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

export const CloseIcon = ({ className, onClick }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    onClick={onClick}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChatIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#BFBFBF"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5073 18.9867C13.6704 18.9955 13.8347 19 14 19C15.2777 19 16.4933 18.7337 17.5942 18.2536L21.3411 18.8993C22.2602 19.0576 23.0592 18.2585 22.9007 17.3395L22.2545 13.5922C22.7341 12.4918 23 11.277 23 10C23 5.02944 18.9706 1 14 1C9.02944 1 5 5.02944 5 10C5 10.1653 5.00446 10.3296 5.01326 10.4927C2.65726 11.469 1 13.791 1 16.5C1 17.4222 1.19207 18.2996 1.53839 19.0943L1.0717 21.8007C0.957241 22.4645 1.5343 23.0416 2.19808 22.9273L4.90418 22.461C5.69928 22.8077 6.57718 23 7.5 23C10.209 23 12.531 21.3427 13.5073 18.9867ZM13.9628 17.1999C13.9874 16.97 14 16.7365 14 16.5C14 12.9101 11.0899 10 7.5 10C7.26354 10 7.03002 10.0126 6.80009 10.0372C6.80003 10.0248 6.8 10.0124 6.8 10C6.8 6.02355 10.0236 2.8 14 2.8C17.9764 2.8 21.2 6.02355 21.2 10C21.2 11.0186 20.9885 11.9877 20.607 12.866C20.4955 13.1226 20.4459 13.4038 20.4869 13.6806L20.8129 15.881L20.8156 15.878L20.9752 16.9746L18.95 16.615L18.937 16.6236L17.8418 16.4348C17.5459 16.3838 17.2434 16.4369 16.97 16.5608C16.0645 16.9714 15.0589 17.2 14 17.2C13.9876 17.2 13.9752 17.2 13.9628 17.1999ZM4.33212 20.7502L5.03486 20.629C5.22468 20.5963 5.41882 20.6303 5.59425 20.7099C6.17528 20.9733 6.82051 21.12 7.5 21.12C10.0516 21.12 12.12 19.0516 12.12 16.5C12.12 13.9484 10.0516 11.88 7.5 11.88C4.94844 11.88 2.88 13.9484 2.88 16.5C2.88 17.1536 3.01572 17.7755 3.2605 18.339C3.33204 18.5037 3.36386 18.6841 3.33755 18.8617L3.12837 20.2737L3.12668 20.2717L3.02427 20.9754L4.32375 20.7446L4.33212 20.7502Z"
    />
  </svg>
);

export const UploadCloudIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M8 16L12 12M12 12L16 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RefreshIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M2 14C2 14 2.12132 14.8492 5.63604 18.364C9.15076 21.8787 14.8492 21.8787 18.364 18.364C19.6092 17.1187 20.4133 15.5993 20.7762 14M2 14V20M2 14H8M22 10C22 10 21.8787 9.15076 18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604C4.39076 6.88131 3.58669 8.40072 3.22383 10M22 10V4M22 10H16"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusSquareIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LeftArrowIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 492 492"
    className={className}
  >
    <path d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124 c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844 L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412 c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008 c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788 C492,219.198,479.172,207.418,464.344,207.418z" />
  </svg>
);

export const VolumeMaxIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M19.7479 5C21.1652 6.97024 22 9.38764 22 12C22 14.6124 21.1652 17.0298 19.7479 19M15.7453 8C16.5362 9.13384 17 10.5128 17 12C17 13.4873 16.5362 14.8662 15.7453 16M9.63432 4.36569L6.46863 7.53137C6.29568 7.70433 6.2092 7.7908 6.10828 7.85264C6.01881 7.90747 5.92127 7.94788 5.81923 7.97237C5.70414 8 5.58185 8 5.33726 8H3.6C3.03995 8 2.75992 8 2.54601 8.109C2.35785 8.20487 2.20487 8.35785 2.10899 8.54601C2 8.75992 2 9.03995 2 9.6V14.4C2 14.9601 2 15.2401 2.10899 15.454C2.20487 15.6422 2.35785 15.7951 2.54601 15.891C2.75992 16 3.03995 16 3.6 16H5.33726C5.58185 16 5.70414 16 5.81923 16.0276C5.92127 16.0521 6.01881 16.0925 6.10828 16.1474C6.2092 16.2092 6.29568 16.2957 6.46863 16.4686L9.63431 19.6343C10.0627 20.0627 10.2769 20.2769 10.4608 20.2914C10.6203 20.3039 10.7763 20.2393 10.8802 20.1176C11 19.9774 11 19.6744 11 19.0686V4.93137C11 4.32556 11 4.02265 10.8802 3.88239C10.7763 3.76068 10.6203 3.69609 10.4608 3.70865C10.2769 3.72312 10.0627 3.93731 9.63432 4.36569Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VolumeMuteIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M22 9L16 15M16 9L22 15M9.63432 4.36568L6.46863 7.53137C6.29568 7.70432 6.2092 7.7908 6.10828 7.85264C6.01881 7.90747 5.92127 7.94787 5.81923 7.97237C5.70414 8 5.58185 8 5.33726 8H3.6C3.03995 8 2.75992 8 2.54601 8.10899C2.35785 8.20487 2.20487 8.35785 2.10899 8.54601C2 8.75992 2 9.03995 2 9.6V14.4C2 14.9601 2 15.2401 2.10899 15.454C2.20487 15.6422 2.35785 15.7951 2.54601 15.891C2.75992 16 3.03995 16 3.6 16H5.33726C5.58185 16 5.70414 16 5.81923 16.0276C5.92127 16.0521 6.01881 16.0925 6.10828 16.1474C6.2092 16.2092 6.29568 16.2957 6.46863 16.4686L9.63431 19.6343C10.0627 20.0627 10.2769 20.2769 10.4608 20.2914C10.6203 20.3039 10.7763 20.2393 10.8802 20.1176C11 19.9774 11 19.6744 11 19.0686V4.93137C11 4.32555 11 4.02265 10.8802 3.88238C10.7763 3.76068 10.6203 3.69609 10.4608 3.70865C10.2769 3.72312 10.0627 3.93731 9.63432 4.36568Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VolumePlusIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M18.5 15.5V8.5M15 12H22M9.63432 4.36569L6.46863 7.53137C6.29568 7.70433 6.2092 7.7908 6.10828 7.85264C6.01881 7.90747 5.92127 7.94788 5.81923 7.97237C5.70414 8 5.58185 8 5.33726 8H3.6C3.03995 8 2.75992 8 2.54601 8.109C2.35785 8.20487 2.20487 8.35785 2.10899 8.54601C2 8.75992 2 9.03995 2 9.6V14.4C2 14.9601 2 15.2401 2.10899 15.454C2.20487 15.6422 2.35785 15.7951 2.54601 15.891C2.75992 16 3.03995 16 3.6 16H5.33726C5.58185 16 5.70414 16 5.81923 16.0276C5.92127 16.0521 6.01881 16.0925 6.10828 16.1474C6.2092 16.2092 6.29568 16.2957 6.46863 16.4686L9.63431 19.6343C10.0627 20.0627 10.2769 20.2769 10.4608 20.2914C10.6203 20.3039 10.7763 20.2393 10.8802 20.1176C11 19.9774 11 19.6744 11 19.0686V4.93137C11 4.32556 11 4.02265 10.8802 3.88239C10.7763 3.76068 10.6203 3.69609 10.4608 3.70865C10.2769 3.72312 10.0627 3.93731 9.63432 4.36569Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VolumeMinusIcon = ({ className }: IconType) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M15 12H22M9.63432 4.36569L6.46863 7.53137C6.29568 7.70433 6.2092 7.7908 6.10828 7.85264C6.01881 7.90747 5.92127 7.94788 5.81923 7.97237C5.70414 8 5.58185 8 5.33726 8H3.6C3.03995 8 2.75992 8 2.54601 8.109C2.35785 8.20487 2.20487 8.35785 2.10899 8.54601C2 8.75992 2 9.03995 2 9.6V14.4C2 14.9601 2 15.2401 2.10899 15.454C2.20487 15.6422 2.35785 15.7951 2.54601 15.891C2.75992 16 3.03995 16 3.6 16H5.33726C5.58185 16 5.70414 16 5.81923 16.0276C5.92127 16.0521 6.01881 16.0925 6.10828 16.1474C6.2092 16.2092 6.29568 16.2957 6.46863 16.4686L9.63431 19.6343C10.0627 20.0627 10.2769 20.2769 10.4608 20.2914C10.6203 20.3039 10.7763 20.2393 10.8802 20.1176C11 19.9774 11 19.6744 11 19.0686V4.93137C11 4.32556 11 4.02265 10.8802 3.88239C10.7763 3.76068 10.6203 3.69609 10.4608 3.70865C10.2769 3.72312 10.0627 3.93731 9.63432 4.36569Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
