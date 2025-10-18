import { forwardRef, useEffect, useRef, useState } from "react";
import Quill, { Delta } from "quill";
import "./editor.css";

import { InfoIcon } from "../../../icons";
import {
  addBlobUrlToImage,
  addIdsToHeadings,
  addIdToLink,
  blockDraggedOrCopiedImage,
  buildToolbarFromOptions,
  createLinkIdButtonToToolbar,
  QuillImage,
  removeDefaultCss,
  removeUnusedBlobUrls,
} from "../../../utils";
import { QuillEditorProps } from "../../../types";
import { defaultToolbarOptions } from "../../../constants";
import QuillToolsGuideModal from "./QuillToolsGuideModal";

Quill.register("formats/image", QuillImage, true);
Quill.register("modules/addIdsToHeadings", addIdsToHeadings);

const QuillEditor = forwardRef<Quill | null, QuillEditorProps>(
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
      toolbarOptions,
      needLinkButton = false,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Quill | null>(null);
    const [isToolGuideOpen, setIsToolGuideOpen] = useState(false);

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
            container: toolbarOptions
              ? buildToolbarFromOptions(toolbarOptions)
              : defaultToolbarOptions,
            handlers: {
              ...(blobUrlsRef && {
                image: function () {
                  addBlobUrlToImage(quill, blobUrlsRef);
                },
              }),
              ...(needLinkButton && {
                addIdToLink: () => addIdToLink(quill),
              }),
            },
          },
          clipboard: {
            matchVisual: true,
            matchers: [
              // *NOTE - To remove copied images
              ["IMG", () => new Delta()],
              // *NOTE - To remove copied styles
              [
                Node.ELEMENT_NODE,
                (_node: HTMLElement, delta: Delta) => removeDefaultCss(delta),
              ],
            ],
          },
          addIdsToHeadings: { enable: true },
        },
      });

      // Add link id button to toolbar
      if (needLinkButton) {
        createLinkIdButtonToToolbar(quill);
      }

      quill.on("text-change", (delta, _oldDelta, source) => {
        // *NOTE - Don't change order
        const html = quill.root.innerHTML.trim();
        const isEmpty = html === "<p><br></p>";

        onChange?.(isEmpty ? "" : html);
        if (!isEmpty && blobUrlsRef) {
          removeUnusedBlobUrls(quill, blobUrlsRef);
        }

        if (source !== "user") return; // only block user actions

        // *NOTE - For prevent drag & drop Or Copy images
        const isDraggedOrCopied = blockDraggedOrCopiedImage(delta);
        if (isDraggedOrCopied) quill.history.undo();
      });

      editorRef.current = quill;

      if (ref) {
        if (typeof ref === "function") {
          ref(quill);
        } else {
          ref.current = quill;
        }
      }

      // **Important**: Cache blobUrlsRef.current here
      const blobUrls = blobUrlsRef?.current;

      return () => {
        if (ref && "current" in ref) {
          ref.current = null;
        }
        container.innerHTML = "";
        // Safe cleanup using cached blobUrls
        if (blobUrls) {
          blobUrls.forEach((url) => URL.revokeObjectURL(url));
          blobUrls.length = 0;
        }
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
          {/* Align It Properly Later */}
          <span
            onClick={() => setIsToolGuideOpen(true)}
            className="border border-(--primary-10) hover:border-(--primary-30) rounded-sm absolute right-3 top-20 min-[400px]:top-3 md:top-12 min-[800px]:top-3! z-10 py-0.5 px-1 w-[34px] h-[30px] flex items-center justify-center cursor-pointer"
          >
            <InfoIcon />
          </span>
        </div>
        {!readOnly && errorText && (
          <p className="w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500">
            <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
            <span>{errorText}</span>
          </p>
        )}
        {/* Make it beautiful later */}
        {/* Quill Tools Guide */}
        {needLinkButton && (
          <QuillToolsGuideModal
            isOpen={isToolGuideOpen}
            onClose={() => setIsToolGuideOpen(false)}
          />
        )}
      </div>
    );
  }
);

export default QuillEditor;
