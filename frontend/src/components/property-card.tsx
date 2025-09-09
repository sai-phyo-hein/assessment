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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'box-shadow 0.3s'
    }}>
      {/* Image Section */}
      <div style={{
        position: 'relative',
        height: '16rem',
        overflow: 'hidden'
      }}>
        <img 
          src={imageUrl} 
          alt={property.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s'
          }}
        />
        {/* Price Badge */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          padding: '0.5rem 0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#111827'
          }}>£{property.per_night_price}</div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280'
          }}>per night</div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        padding: '1.5rem'
      }}>
        {/* Property Name */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          {property.name}
        </h3>
        
        {/* Location */}
        <p style={{
          color: '#6B7280',
          marginBottom: '1rem'
        }}>
          {property.location}
        </p>

        {/* Property Details */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#374151'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Bed style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span>{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Bath style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span>{property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Users style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span>Up to {property.max_guests} guests</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PropertyCard;