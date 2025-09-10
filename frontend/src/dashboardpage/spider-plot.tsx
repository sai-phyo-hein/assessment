import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../global-store';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

interface Review {
  id: number;
  propertyId: number;
  rating: number;
  reviewCategory: string[];
}

interface SpiderPlotProps {
}

const SpiderPlot: React.FC<SpiderPlotProps> = () => {
  const { dbSelectedProperty } = useAppStore();
  const [categoryData, setCategoryData] = useState<Array<{ category: string; count: number }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!dbSelectedProperty) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch reviews for the selected property
        const response = await fetch(`${BACKEND_URL}/reviews?propertyId=${dbSelectedProperty.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviews: Review[] = await response.json();

        // Count review categories
        const categoryCount: { [key: string]: number } = {};

        reviews.forEach(review => {
          if (review.reviewCategory && Array.isArray(review.reviewCategory)) {
            review.reviewCategory.forEach(category => {
              categoryCount[category] = (categoryCount[category] || 0) + 1;
            });
          }
        });

        // Convert to array format for the chart
        const allCategories = ['amenities', 'check-in', 'cleanliness', 'communication', 'environment', 'living', 'location', 'service', 'value'];
        const chartData = allCategories.map(category => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count: categoryCount[category] || 0
        }));

        setCategoryData(chartData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [dbSelectedProperty]);

  if (!dbSelectedProperty) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          Select a property to view review analysis
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-center text-gray-500">Loading review data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          No review categories found for this property
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={categoryData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'dataMax']}
              tick={{ fontSize: 10, fill: '#6B7280' }}
            />
            <Radar
              name="Review Count"
              dataKey="count"
              stroke="#1C4B4B"
              fill="#1a6844"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpiderPlot;
