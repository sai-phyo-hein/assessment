import React, { useState, useEffect } from 'react';
import DetailSection from './detail-section';
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

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'high-values' | 'need-attention'>('high-values');
  const [highValueProperties, setHighValueProperties] = useState<Property[]>([]);
  const [needAttentionProperties, setNeedAttentionProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { setDbSelectedProperty } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch property performance data from backend
        const performanceResponse = await fetch(`${BACKEND_URL}/property-performance`);
        if (!performanceResponse.ok) {
          throw new Error('Failed to fetch property performance data');
        }
        const performanceData = await performanceResponse.json();

        setHighValueProperties(performanceData.highValue);
        setNeedAttentionProperties(performanceData.needAttention);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (setDbSelectedProperty) {
      const properties = activeTab === 'high-values' ? highValueProperties : needAttentionProperties;
      setDbSelectedProperty(properties.length > 0 ? properties[0] : undefined);
    }
  }, [activeTab, highValueProperties, needAttentionProperties, setDbSelectedProperty]);

  if (loading) {
    return (
      <div className="pt-4">
        <div className="text-center text-gray-500 py-8">Loading property data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4">
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pt-4">

      {/* Tab Navigation */}
      <div className="flex mt-[-2rem]">
        <button
          className={`flex-1 px-6 py-3 text-sm font-medium rounded-none transition-all duration-200 ${
            activeTab === 'high-values'
              ? 'bg-vanilla text-flex-green font-bold shadow-sm'
              : 'bg-flex-green/30 text-white hover:bg-flex-green'
          }`}
          onClick={() => setActiveTab('high-values')}
        >
          High Values
        </button>
        <button
          className={`flex-1 px-6 py-3 text-sm font-medium rounded-none transition-all duration-200 ${
            activeTab === 'need-attention'
              ? 'bg-vanilla text-flex-green font-bold shadow-sm'
              : 'bg-flex-green/30 text-white hover:bg-flex-green/80'
          }`}
          onClick={() => setActiveTab('need-attention')}
        >
          Need Attention
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] border border-gray-200 border-t-0 rounded-b-lg overflow-hidden">
        {activeTab === 'high-values' && (
          <div className="bg-vanilla p-3 space-y-4">
            <DetailSection type="high-values" properties={highValueProperties} />
          </div>
        )}

        {activeTab === 'need-attention' && (
          <div className="bg-vanilla p-3 space-y-4">
            <DetailSection type="need-attention" properties={needAttentionProperties} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetails;
