import { forwardRef, RefObject, useEffect, useRef } from "react";
import "./editor.css";
import { InfoIcon } from "../../icons";
import Quill from "quill";
import {
  addBlobUrlToImage,
  addIdsToHeadings,
  removeUnusedBlobUrls,
} from "../../utils";

// Allow blob URLs in image sanitize
const Image = Quill.import("formats/image") as {
  sanitize?: (url: string) => string;
};
if (Image && typeof Image.sanitize === "function") {
  Image.sanitize = function (url: string): string {
    if (url.startsWith("blob:")) return url;
    const Link = Quill.import("formats/link") as {
      sanitize?: (url: string) => string;
    };
    return Link?.sanitize ? Link.sanitize(url) : url;
  };
}
Quill.register("formats/image", Image, true);
Quill.register("modules/addIdsToHeadings", addIdsToHeadings);

interface EditorProps {
  label?: string;
  readOnly?: boolean;
  errorText?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  blobUrlsRef: RefObject<string[]>;
  placeholder?: string;
}

const QuillMarkupEditor = forwardRef<Quill | null, EditorProps>(
  (
    {
      label,
      readOnly,
      errorText,
      className,
      value,
      onChange,
      placeholder = "Write your content here...",
      blobUrlsRef,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Quill | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const editorContainer = document.createElement("div");
      container.innerHTML = "";
      container.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: {
            container: [
              [{ header: [false, 4, 3, 2, 1] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["link", "image"],
              ["clean"],
            ],
            handlers: {
              image: function () {
                addBlobUrlToImage(quill, blobUrlsRef);
              },
            },
          },
          clipboard: {
            matchVisual: true,
          },
          addIdsToHeadings: {
            enable: true,
          },
        },
      });

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        if (html !== "<p><br></p>") {
          onChange?.(html);
          removeUnusedBlobUrls(quill, blobUrlsRef);
        } else {
          onChange?.("");
        }
      });

      editorRef.current = quill;

      if (typeof ref === "function") {
        ref(quill);
      } else if (ref && "current" in ref) {
        ref.current = quill;
      }

      return () => {
        if (ref && "current" in ref) {
          ref.current = null;
        }
        container.innerHTML = "";
        // Revoke all blob URLs
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current = [];
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set value when it changes from outside
    useEffect(() => {
      if (editorRef.current && value !== editorRef.current.root.innerHTML) {
        editorRef.current.root.innerHTML = value || "";
      }
    }, [value]);

    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    return (
      <div className={`w-full space-y-1.5 ${className}`}>
        <div className="relative">
          {label && (
            <span className="text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 2xl:py-1 bg-smoke-eerie rounded">
              {label}
            </span>
          )}
          <div
            ref={containerRef}
            id="custom-editor"
            className="w-full bg-smoke-eerie rounded-lg border border-primary-10 text-primary flex flex-col gap-2"
          />
        </div>
        {!readOnly && errorText && (
          <p className="w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500">
            <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
            <span>{errorText}</span>
          </p>
        )}
      </div>
    );
  }
);

export default QuillMarkupEditor;
