import { RefObject } from "react";
import CryptoJS from "crypto-js";
import Quill from "quill";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../envs";
import { MB } from "../constants";
import { toastErrorMessage } from "./toast.util";
import { IToolBarOptions, QuillToolbar } from "../types";

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
