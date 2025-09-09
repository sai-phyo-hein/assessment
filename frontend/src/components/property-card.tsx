import React from 'react';
import { Bed, Bath, Users } from 'lucide-react';

interface Property {
  name: string;
  per_night_price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
}

interface PropertyCardProps {
  property: Property;
  imageUrl?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  imageUrl = "https://placehold.co/600x400"  // Default image URL
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-md px-3 py-2 shadow-md">
          <div className="text-lg font-bold text-gray-900">
            £{property.per_night_price}
          </div>
          <div className="text-sm text-gray-500">
            per night
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Property Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property.name}
        </h3>
        
        {/* Location */}
        <p className="text-gray-500 mb-4">
          {property.location}
        </p>

        {/* Property Details */}
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Up to {property.max_guests} guests</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PropertyCard;