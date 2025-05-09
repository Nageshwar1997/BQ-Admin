import Quill from "quill";
import { RefObject } from "react";
import { UseFormSetValue } from "react-hook-form";
import { CloudinaryConfigOptionType, ProductType } from "../../../types";
import { upload_single_image } from "../../../api/media/media.api";

export const processQuillContent = async (
  quillRef: RefObject<Quill | null>,
  blobUrlsRef: RefObject<string[]>,
  setValue: UseFormSetValue<ProductType>,
  fieldName: keyof ProductType,
  folderName: string,
  cloudinaryConfigOption: CloudinaryConfigOptionType
) => {
  if (!quillRef.current) return;
  const quill = quillRef.current;
  let content = quill.root.innerHTML;

  if (blobUrlsRef.current.length > 0) {
    const uploadPromises = blobUrlsRef.current.map(async (blobUrl, index) => {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const ext = blob.type.split("/")[1]; // e.g: jpeg, png, etc
        const file = new File([blob], `image_${index}.${ext}`, {
          type: blob.type,
        });

        const formData = new FormData();
        formData.append("image", file);
        formData.append("folderName", folderName);
        formData.append("cloudinaryConfigOption", cloudinaryConfigOption);

        const data = await upload_single_image(formData);

        return { blobUrl, cloudUrl: data.cloudUrl };
      } catch (error) {
        console.error("Image upload error:", error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    const validUploadedImages = uploadedImages.filter(
      (img): img is { blobUrl: string; cloudUrl: string } => img !== null
    );

    validUploadedImages.forEach(({ blobUrl, cloudUrl }) => {
      content = content.replace(blobUrl, cloudUrl);
    });

    quill.root.innerHTML = content;
  }

  setValue(fieldName, content);
};

export const getQuillValue = (value: string | undefined) => {
  return value ? (value !== "<p><br></p>" ? value : "") : "";
};
