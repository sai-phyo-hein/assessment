import React, { useEffect, useState } from 'react';
import { Gallery } from './gallery';
import { Image, useAppStore } from '../global-store';
import { Bed, Bath, Users } from 'lucide-react';
import ReviewSlideShow from './review-slideshow';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

interface PropertyDetailPageProps {
  folderId: string;
}

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ folderId }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedProperty = useAppStore((state) => state.selectedProperty);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/images/${folderId}`);
        if (!res.ok) throw new Error("Failed to fetch image list");
        const data = await res.json();
        if (!data.images) throw new Error("No images found");
        const imgs: Image[] = data.images.map((filename: string) => {
          let type = "other";
          if (filename.includes("bathroom")) type = "bathroom";
          else if (filename.includes("bedroom")) type = "bedroom";
          else if (filename.includes("kitchen")) type = "kitchen";
          else if (filename.includes("frontal")) type = "main";
          return {
            src: `${BACKEND_URL}/images/${folderId}/${filename}`,
            alt: filename,
            type,
          };
        });
        setImages(imgs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [folderId]);

  return (
    <div className="container mx-auto p-4 flex flex-col">
      {loading && <div>Loading images...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <Gallery images={images} />}

      {/* Content and Slideshow Section Side by Side */}
      <div className="flex flex-row gap-8 mt-[-2rem] border-b border-gray-300">
        {selectedProperty && (
          <div className="flex-1 bg-white bg-opacity-90 p-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-5">
              {selectedProperty.name}
            </h1>
            <div className="flex items-center gap-16 text-sm text-gray-700">
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-5 h-5" />
                <span className="text-center">{selectedProperty.max_guests} <br/>guests</span>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <Bed className="w-5 h-5" />
                <span className="text-center">{selectedProperty.bedrooms} <br/>Bedroom{selectedProperty.bedrooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <Bath className="w-5 h-5" />
                <span className="text-center">{selectedProperty.bathrooms} <br/>Bathroom{selectedProperty.bathrooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <Bath className="w-5 h-5" />
                <span className="text-center">{selectedProperty.beds} <br/>Bed{selectedProperty.beds > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}
        <div className="w-full max-w-md mt-[-1rem]">
          <ReviewSlideShow />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;