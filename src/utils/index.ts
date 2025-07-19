import { RefObject } from "react";
import CryptoJS from "crypto-js";
import Quill from "quill";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../envs";
import { MB } from "../constants";
import { toastErrorMessage } from "./toast.util";
import { IToolBarOptions, QuillToolbar } from "../types";

const TOKEN_KEY = "admin_token";
const SECRET_KEY = envs.ENCRYPTION_SECRET_KEY;

export const encryptData = (data: object | string) => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(stringData, SECRET_KEY);
  return encrypted.toString();
};

export const decryptData = (
  encryptedData: string | null
): object | string | null => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (decrypted) {
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }

  return null;
};

const getLocalToken = () => localStorage.getItem(TOKEN_KEY);
const getSessionToken = () => sessionStorage.getItem(TOKEN_KEY);

const removeLocalToken = () => localStorage.removeItem(TOKEN_KEY);
const removeSessionToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const saveLocalToken = (token: string) => {
  const encryptedToken = encryptData(token);
  localStorage.setItem(TOKEN_KEY, encryptedToken);
  removeSessionToken();
};
export const saveSessionToken = (token: string) => {
  const encryptedToken = encryptData(token);
  sessionStorage.setItem(TOKEN_KEY, encryptedToken);
  removeLocalToken();
};

const getStorageToken = () => {
  let token: string | null = null;
  const LToken = getLocalToken();
  const SToken = getSessionToken();
  if (LToken) {
    token = LToken;
  } else if (SToken) {
    token = SToken;
  }

  return token;
};

export const removeStorageToken = (): void => {
  removeLocalToken();
  removeSessionToken();
};

export const getAdminToken = () => {
  const raw_token = getStorageToken();
  if (!raw_token) {
    throw new Error("No Token found");
  }

  const token = decryptData(raw_token) as string | null;
  if (!token) {
    throw new Error("No Token found");
  }
  return token;
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
    if (file.size > 2 * MB) {
      toastErrorMessage("Image size must be under 2MB!");
      return;
    }

    const blobUrl = URL.createObjectURL(file);

    const range = quill.getSelection();
    if (!range) return;

    blobUrlsRef.current?.push(blobUrl);

    quill.insertEmbed(range.index, "image", blobUrl, "user");

    quill.setSelection({ index: range.index + 1, length: 0 });
  };
};

export function addIdsToHeadings(quill: Quill, options: { enable: boolean }) {
  if (!options.enable) return;

  const processHeadings = () => {
    const headings = quill.root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading: Element) => {
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

  const removedBlobUrls = blobUrlsRef.current?.filter(
    (url) => !editorImages.includes(url)
  );

  removedBlobUrls?.forEach((url) => URL.revokeObjectURL(url));

  if (blobUrlsRef.current) {
    const filteredUrls = blobUrlsRef.current.filter((url) =>
      editorImages.includes(url)
    );
    blobUrlsRef.current.length = 0; // clear old
    blobUrlsRef.current.push(...filteredUrls); // add new
  }
};

export const buildToolbarFromOptions = (
  options?: IToolBarOptions
): QuillToolbar => {
  if (!options) return [];

  const toolbar: QuillToolbar = [];

  if (options.header?.length) toolbar.push([{ header: options.header }]);
  if (options.text?.length) toolbar.push(options.text);
  if (options.list?.length)
    toolbar.push(options.list.map((item) => ({ list: item })));
  if (options.script?.length)
    toolbar.push(options.script.map((item) => ({ script: item })));
  if (options.indent?.length)
    toolbar.push(options.indent.map((item) => ({ indent: item })));
  if (options.color || options.background) {
    const colorOptions = [
      ...(options.color ? [{ color: [] }] : []),
      ...(options.background ? [{ background: [] }] : []),
    ];
    if (colorOptions.length) toolbar.push(colorOptions);
  }
  if (options.align) toolbar.push([{ align: [] }]);
  if (options.direction) toolbar.push([{ direction: options.direction }]);
  if (options.media?.length) toolbar.push(options.media);
  if (options.misc?.length) toolbar.push(options.misc);

  return toolbar;
};

export const toINRCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};
