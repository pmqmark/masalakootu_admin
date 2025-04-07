import { useState } from "react";
import imageCompression from "browser-image-compression";

const useImageCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = async (file, options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true }) => {
    try {
      setIsCompressing(true);
      const compressedFile = await imageCompression(file, options);
      setIsCompressing(false);
      return compressedFile;
    } catch (error) {
      console.error("Image compression failed", error);
      setIsCompressing(false);
      throw error;
    }
  };

  return { compressImage, isCompressing };
};

export default useImageCompression;
