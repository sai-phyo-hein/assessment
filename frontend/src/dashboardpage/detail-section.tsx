import React, { useState, useEffect } from 'react';
import ItemCard from './item-card';
import SpiderPlot from './spider-plot';
import { useAppStore } from '../global-store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

interface DetailSectionProps {
  type: 'high-values' | 'need-attention';
  properties: Property[];
}

const DetailSection: React.FC<DetailSectionProps> = ({ type, properties }) => {
  const { dbSelectedProperty } = useAppStore();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!dbSelectedProperty) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/property-monthly-rating/${dbSelectedProperty.id}`);
        if (response.ok) {
          const data = await response.json();
          setChartData(data.monthlyRating || []);
        }
        const reviewResponse = await fetch(`${BACKEND_URL}/reviews?propertyId=${dbSelectedProperty.id}`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          setReviews(reviewData);
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [dbSelectedProperty]);

  const handleApprove = async (reviewId: number) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;
    console.log("REviews:", reviews);
    const newApproved = !review.approved;

    // Optimistically update local state
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: newApproved } : r));

    try {
      const response = await fetch(`${BACKEND_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: newApproved }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review approval');
      }
    } catch (error) {
      console.error('Error updating review approval:', error);
      // Revert local state on error
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: !newApproved } : r));
    }
  };

  return (
    <div className="p-6 bg-white/30 border border-gray-200 rounded-lg shadow-sm">
      {/* Header and Quick Insights - Horizontal Layout */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-gray-800">
          {type === 'high-values' ? 'High Value Properties' : 'Properties Needing Attention'}
        </h4>

        {/* Quick Insights - Horizontal */}
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <span>• Properties in London: <span className="italic text-flex-green">{properties.filter(p => p.location === 'London').length}</span></span>
            <span>• 1-Bedroom: <span className="italic text-flex-green">{properties.filter(p => p.bedrooms === 1).length}</span></span>
            <span>• 2-Bedroom: <span className="italic text-flex-green">{properties.filter(p => p.bedrooms === 2).length}</span></span>
            <span>• 3-Bedroom: <span className="italic text-flex-green">{properties.filter(p => p.bedrooms === 3).length}</span></span>
            <span>• &gt;3 Bedroom: <span className="italic text-flex-green">{properties.filter(p => p.bedrooms > 3).length}</span></span>
            <span>• Max capacity ≥ 4: <span className="italic text-flex-green">{properties.filter(p => p.max_guests >= 4).length}</span></span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-4">
        {/* Left column - 25% width */}
        <div className="w-1/4">
          <div className="bg-gray-50 p-4 rounded-lg bg-gray-200 h-full">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {properties.length === 0 ? (
                <div className="text-center text-gray-500 py-2">
                  No properties found in this category.
                </div>
              ) : (
                properties.map((property) => (
                  <ItemCard key={property.id} property={property} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column - 75% width */}
        <div className="w-3/4 grid grid-cols-2 grid-rows-2 gap-4">
          {/* Row 1, Col 1 */}
          <div className="col-span-1 row-span-1">
            {dbSelectedProperty && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm text-xs" style={{ height: 200 }}>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="averageRating" stroke="#0a3c26" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">No data available</p>
                )}
              </div>
            )}
          </div>
          {/* Row 1, Col 2 */}
          <div className="col-span-1 row-span-2">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-full">
              <h3 className="text-md font-semibold mb-4">Review Approvals</h3>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-sm px-4 py-2">Review</th>
                    <th className="text-sm px-4 py-2">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review.id}>
                      <td className="text-sm px-4 py-2">{review.publicReview}</td>
                      <td className="text-sm px-4 py-2">
                        <input 
                          type="checkbox" 
                          checked={review.approved} 
                          disabled={type === 'need-attention' && !review.approved}
                          onChange={() => handleApprove(review.id)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Row 2, Col 1 */}
          <div className="col-span-1 row-span-1 bg-gray-50">
            <SpiderPlot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
