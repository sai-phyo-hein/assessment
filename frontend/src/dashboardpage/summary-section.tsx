import React, { useState, useEffect } from 'react';
import { useAppStore } from '../global-store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

interface AverageRatingData {
  averageRating: number;
}

interface TotalReviewedPropertiesData {
  totalReviewedProperties: number;
}

interface TotalReviewsData {
  totalReviews: number;
}

interface MonthlyData {
  month: string;
  value: number;
}

const SummarySection: React.FC = () => {
  const { startDate, endDate } = useAppStore();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviewedProperties, setTotalReviewedProperties] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('averageRating');
  const [barData, setBarData] = useState<any[]>([]);

  const formatDateForAPI = (date: Date | null | undefined): string | undefined => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const fetchMonthlyData = async (metric: string) => {
    try {
      let endpoint = '';
      let key = '';
      if (metric === 'averageRating') {
        endpoint = '/monthly-average-rating';
        key = 'monthlyAverageRating';
      } else if (metric === 'totalReviewedProperties') {
        endpoint = '/monthly-total-reviewed-properties';
        key = 'monthlyTotalReviewedProperties';
      } else if (metric === 'totalReviews') {
        endpoint = '/monthly-total-reviews';
        key = 'monthlyTotalReviews';
      }
      const response = await fetch(`${BACKEND_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${metric}`);
      }
      const data = await response.json();
      const formattedData = data[key].map((item: any) => ({
        month: item.month,
        value: item[metric] || item.averageRating || item.totalReviewedProperties || item.totalReviews
      }));
      setChartData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        
        const startDateParam = formatDateForAPI(startDate);
        const endDateParam = formatDateForAPI(endDate);
        const queryParams = new URLSearchParams();
        if (startDateParam) queryParams.append('start_date', startDateParam);
        if (endDateParam) queryParams.append('end_date', endDateParam);
        const queryString = queryParams.toString();
        
        // Fetch average rating with date filter
        const ratingResponse = await fetch(`${BACKEND_URL}/average-rating${queryString ? '?' + queryString : ''}`);
        if (!ratingResponse.ok) {
          throw new Error('Failed to fetch average rating');
        }
        const ratingData: AverageRatingData = await ratingResponse.json();
        setAverageRating(ratingData.averageRating);

        // Fetch total reviewed properties with date filter
        const propertiesResponse = await fetch(`${BACKEND_URL}/total-reviewed-properties${queryString ? '?' + queryString : ''}`);
        if (!propertiesResponse.ok) {
          throw new Error('Failed to fetch total reviewed properties');
        }
        const propertiesData: TotalReviewedPropertiesData = await propertiesResponse.json();
        setTotalReviewedProperties(propertiesData.totalReviewedProperties);

        // Fetch total reviews with date filter
        const reviewsResponse = await fetch(`${BACKEND_URL}/total-reviews-filtered${queryString ? '?' + queryString : ''}`);
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch total reviews');
        }
        const reviewsData: TotalReviewsData = await reviewsResponse.json();
        setTotalReviews(reviewsData.totalReviews);

        // Fetch reviews for categories
        const reviewsFetchResponse = await fetch(`${BACKEND_URL}/review-categories`);
        if (!reviewsFetchResponse.ok) {
          throw new Error('Failed to fetch review categories');
        }
        const barData = await reviewsFetchResponse.json();
        setBarData(barData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
    fetchMonthlyData('averageRating'); // Load initial chart data
  }, [startDate, endDate]);

  useEffect(() => {
    fetchMonthlyData(selectedMetric);
  }, [selectedMetric]);

  return (
    <div className="p-6 bg-vanilla">
      <h2 className="text-2xl font-bold mb-4">Review Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Average Rating Card */}
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedMetric('averageRating')}>
          <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex items-center">
              <span className="text-3xl font-bold text-yellow-500 mr-2">
                {averageRating !== null ? averageRating.toFixed(1) : 'N/A'}
              </span>
              <span className="text-gray-600">/ 10</span>
            </div>
          )}
        </div>
        {/* Placeholder for other cards */}
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedMetric('totalReviewedProperties')}>
          <h3 className="text-lg font-semibold mb-2">Total Reviewed Properties</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-3xl font-bold text-blue-500">
              {totalReviewedProperties !== null ? totalReviewedProperties : 'N/A'}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedMetric('totalReviews')}>
          <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-3xl font-bold text-green-500">
              {totalReviews !== null ? totalReviews : 'N/A'}
            </p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">
                Monthly {selectedMetric === 'averageRating' ? 'Average Rating' : selectedMetric === 'totalReviewedProperties' ? 'Total Reviewed Properties' : 'Total Reviews'}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0a3c26" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Review Categories</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0a3c26" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
