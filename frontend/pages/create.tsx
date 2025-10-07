import { useState, useContext, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import getCroppedImg from '../utils/cropImage';

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
    <div className="container mx-auto p-4">
      <textarea className="w-full" value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" />
      <input type="file" multiple accept="image/*" onChange={onFileChange} />
      <div className="grid grid-cols-2 gap-2 mt-4">
        {images.map((img, i) => (
          <div key={i}>
            <img src={img} alt="" className="w-full" />
            <button onClick={() => setCurrentImageIndex(i)}>Crop</button>
          </div>
        ))}
      </div>
      {currentImageIndex !== -1 && (
        <div className="relative w-full h-96 mt-4">
          <Cropper
            image={images[currentImageIndex]}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} // Adjustable
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button onClick={cropImage}>Save Crop</button>
        </div>
      )}
      <button onClick={submit} className="mt-4">Post</button>
    </div>
  );
};

export default CreateFeed;