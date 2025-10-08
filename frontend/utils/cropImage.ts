import { Area } from "react-easy-crop";

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area | null,
): Promise<string> => {
  if (!pixelCrop) return imageSrc;

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(imageSrc);
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
};

export default getCroppedImg;
