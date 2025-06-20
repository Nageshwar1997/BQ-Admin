import { IProcessQuillContent } from "../../../types";
import { upload_single_image } from "../../../api/media/media.api";
import { productSchema } from "./product.schema";

export const processQuillContent = async ({
  quillRef,
  blobUrlsRef,
  setValue,
  fieldName,
  folderName,
  cloudinaryConfigOption,
  setLoading,
}: IProcessQuillContent<typeof productSchema>) => {
  if (!quillRef.current) return;
  const quill = quillRef.current;
  let content = quill.root.innerHTML;

  // If no blob images, just set the value and return
  if (!blobUrlsRef.current || blobUrlsRef.current.length === 0) {
    setValue(fieldName, content);
    return;
  }

  if (setLoading) {
    setLoading(true);
  }
  try {
    const uploadPromises = blobUrlsRef.current.map(async (blobUrl, index) => {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const ext = blob.type.split("/")[1] || "webp";

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
    setValue(fieldName, content);
  } finally {
    if (setLoading) {
      setLoading(false); // End loading no matter what
    }
  }
};

export const getQuillValue = (value: string | undefined) => {
  return value ? (value !== "<p><br></p>" ? value : "") : "";
};
