import React from 'react';

interface Image {
  src: string;
  alt: string;
  type: string;
}

interface GalleryProps {
  images: Image[];
}

const Gallery = ({ images }: GalleryProps) => {
  return (
    <div className="flex w-full p-0 m-0">
      <div className="w-1/2">
        <div className="gallery-item rounded-lg overflow-hidden">
          <img src={images[0].src} alt={images[0].alt} data-type={images[0].type} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="w-1/2 pl-2">
        <div className="grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="gallery-item rounded-lg overflow-hidden">
              <img src={image.src} alt={image.alt} data-type={image.type} className="w-full h-full object-cover" />
            </div>
          ))}
          <button className="col-span-2 text-center py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-gray-50 mt-2">
            View all photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;