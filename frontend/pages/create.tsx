import { useState, useContext, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import getCroppedImg from '../utils/cropImage';
import Header from '../components/Header';

const CreateFeed = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) return alert('Max 4 images');
    const newImages = files.map((f) => URL.createObjectURL(f));
    setImages([...images, ...newImages]);
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      const croppedImage = await getCroppedImg(images[currentImageIndex], croppedAreaPixels);
      const newImages = [...images];
      newImages[currentImageIndex] = croppedImage;
      setImages(newImages);
      setCurrentImageIndex(-1);
    } catch (e) {
      console.error(e);
    }
  };

  const submit = async () => {
    const formData = new FormData();
    formData.append('text', text);
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      formData.append('images', blob, `image${i}.jpg`);
    }
    await axios.post('/feeds', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white p-6 rounded-xl shadow-2xl">
          <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
          <textarea
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            className="mb-4"
          />
          <div className="grid grid-cols-2 gap-2 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => setCurrentImageIndex(i)}
                  className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Crop
                </button>
              </div>
            ))}
          </div>
          {currentImageIndex !== -1 && (
            <div className="mb-4">
              <div className="relative w-full h-96 bg-gray-200 rounded">
                <Cropper
                  image={images[currentImageIndex]}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <button
                onClick={cropImage}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Crop
              </button>
            </div>
          )}
          <button
            onClick={submit}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;