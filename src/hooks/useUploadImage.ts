import { useState } from "react";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duwxk6nv2/image/upload";
const UPLOAD_PRESET = "product_uploads";

export const useUploadImage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error al subir imagen a Cloudinary:", error);
      return "";
    }
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return { imageFile, imagePreview, handleImageChange, uploadImage, resetImage };
};
