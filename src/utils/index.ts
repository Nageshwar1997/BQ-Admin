import { RefObject } from "react";
import CryptoJS from "crypto-js";
import Quill from "quill";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../envs";

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, envs.ENCRYPTION_SECRET_KEY).toString();
};

export const saveUserLocal = (data: string) => {
  removeUserSession();
  localStorage.setItem("admin_token", encryptData(JSON.stringify(data)));
};

export const saveUserSession = (data: string) => {
  removeUserLocal();
  sessionStorage.setItem("admin_token", encryptData(JSON.stringify(data)));
};

export const removeUserLocal = () => {
  localStorage.removeItem("admin_token");
};

export const removeUserSession = () => {
  sessionStorage.removeItem("admin_token");
};

export const getAdminToken = () => {
  const admin_token =
    localStorage.getItem("admin_token") ||
    sessionStorage.getItem("admin_token");

  if (!admin_token) {
    throw new Error("No Token found");
  }

  return JSON.parse(
    CryptoJS.AES.decrypt(admin_token, envs.ENCRYPTION_SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    )
  );
};

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300
): ((...args: Args) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const addBlobUrlToImage = (
  quill: Quill,
  blobUrlsRef: RefObject<string[]>
) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be under 2MB!");
      return;
    }

    const blobUrl = URL.createObjectURL(file);

    const range = quill.getSelection();
    if (!range) return;

    blobUrlsRef.current.push(blobUrl);

    quill.insertEmbed(range.index, "image", blobUrl, "user");

    quill.setSelection(range.index + 1);
  };
};

export function addIdsToHeadings(quill: Quill, options: { enable: boolean }) {
  if (!options.enable) return;

  const processHeadings = () => {
    const headings = quill.container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      if (heading.id) return;
      heading.id = uuidv4();
    });
  };

  const debouncedProcess = debounce(processHeadings, 200);
  quill.on("text-change", debouncedProcess);
}

export const removeUnusedBlobUrls = (
  quill: Quill,
  blobUrlsRef: RefObject<string[]>
) => {
  const editorImages = Array.from(quill.root.querySelectorAll("img")).map(
    (img) => img.getAttribute("src")
  );

  const removedBlobUrls = blobUrlsRef.current.filter(
    (url) => !editorImages.includes(url)
  );

  removedBlobUrls.forEach((url) => URL.revokeObjectURL(url));

  blobUrlsRef.current = blobUrlsRef.current.filter((url) =>
    editorImages.includes(url)
  );
};

export const toINRCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
