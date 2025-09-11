import React from 'react';
import { useAppStore } from '../global-store';

interface Property {
  name: string;
  per_night_price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  id: number;
  beds: number;
  averageRating: number;
}

interface ItemCardProps {
  property: Property;
}

const ItemCard: React.FC<ItemCardProps> = ({ property }) => {
  const { setDbSelectedProperty, setShowPropertyDetailPage } = useAppStore();

  const handleClick = () => {
    if (setDbSelectedProperty && setShowPropertyDetailPage) {
      setDbSelectedProperty(property);
      setShowPropertyDetailPage(true);
    }
  };

  return (
    <div
      className="border bg-gray-50 rounded-lg p-3 hover:bg-white transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h6 className="font-medium text-gray-800 text-sm">{property.name}</h6>
        <span className="text-green-600 font-semibold text-sm">
          £{property.per_night_price}/night
        </span>
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Location: {property.location}</span>
          <span>Rating: {property.averageRating.toFixed(1)} ⭐</span>
        </div>
        <div className="flex justify-between">
          <span>
            {property.bedrooms} bed • {property.bathrooms} bath
          </span>
          <span>Max {property.max_guests} guests</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
