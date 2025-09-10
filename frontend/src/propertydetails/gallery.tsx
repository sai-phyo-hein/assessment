import { Image } from '../global-store';
import { Expand  } from 'lucide-react';

interface GalleryProps {
  images: Image[];
}

export const Gallery = ({ images }: GalleryProps) => {
  return (
    <div className="flex w-full p-0 m-0">
      <div className="w-1/2">
        <div className="gallery-item rounded-lg overflow-hidden" style={{ height: '90vh' }}>
          <img src={images[0].src} alt={images[0]?.alt || ''} data-type={images[0]?.type || ''} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="w-1/2 pl-2">
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <div key={index} className="gallery-item rounded-lg overflow-hidden" style={{ height: '44vh' }}>
              <img src={image.src} alt={image.alt} data-type={image.type} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="col-span-2 flex justify-end m-2" style={{ transform: 'translateY(-70px)' }}>
            <button className="text-center py-2.5 bg-white bg-opacity-50 border border-gray-300 rounded-lg cursor-pointer text-sm text-gray-700 w-50">
              <span className="inline-flex items-center gap-2 text-white">
                <Expand size={20} />
                View all photos
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};