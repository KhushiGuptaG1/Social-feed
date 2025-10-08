import { useState, useContext, useEffect } from "react";
import axios from "../lib/axiosSetup";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const CreateFeed = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages(files);
      setCurrentImageIndex(0);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const applyCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], `cropped_${currentImageIndex}.jpg`, { type: "image/jpeg" });
      const newImages = [...images];
      newImages[currentImageIndex] = file;
      setImages(newImages);
      if (currentImageIndex < images.length - 1) {
        const nextIndex = currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        const nextFile = images[nextIndex];
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(nextFile);
      } else {
        setShowCropper(false);
      }
    }
  };

  const skipCrop = () => {
    if (currentImageIndex < images.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      const nextFile = images[nextIndex];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(nextFile);
    } else {
      setShowCropper(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("text", text);
      images.forEach((image) => {
        formData.append("images", image);
      });

      await axios.post("/feeds", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Add Images (up to 4)
              </label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {showCropper && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Cropping image {currentImageIndex + 1} of {images.length}
                  </p>
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={applyCrop}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Apply Crop
                    </button>
                    <button
                      type="button"
                      onClick={skipCrop}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
              {images.length > 0 && !showCropper && (
                <p className="text-sm text-gray-500 mt-2">
                  {images.length} image(s) selected
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateFeed;
