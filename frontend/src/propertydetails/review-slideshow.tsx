import React, { useEffect, useState } from 'react';
import Star from './star';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../global-store';

interface Review {
  id: number;
  guestName: string;
  publicReview: string;
  rating: number;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ReviewSlideShow: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newReview, setNewReview] = useState({ guestName: '', publicReview: '', rating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedProperty = useAppStore((state) => state.selectedProperty);

  useEffect(() => {
    console.log('Selected Property:', selectedProperty, 'ID:', selectedProperty?.id);
    const fetchReviews = async () => {
      if (!selectedProperty?.id && selectedProperty?.id !== 0) {
        console.log('No property ID, setting loading to false');
        setLoading(false);
        setError('No property selected');
        return;
      }
      setLoading(true);
      setError(null);
      const url = `${BACKEND_URL}/reviews?propertyId=${selectedProperty.id}`;
      console.log('Fetching URL:', url);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch reviews: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        console.log('Fetched Reviews:', data);
        setReviews(data);
        setCurrentIndex(0);
      } catch (err: any) {
        console.error('Fetch Error:', err);
        setError(err.name === 'AbortError' ? 'Request timed out' : err.message);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };
    fetchReviews();
  }, [selectedProperty?.id]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Note: handleReviewSubmit is left as a placeholder for future backend integration
  const handleReviewSubmit = () => {
    // Implement POST to backend if needed
    setIsPopupOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {loading ? (
        <div className="text-center">Loading reviews...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div
            className="relative bg-vanilla shadow-lg rounded-lg p-6 cursor-pointer"
            onClick={() => setIsPopupOpen(true)}
          >
            <div className="text-center">
              <div className="flex flex-col items-center">
                {reviews.length === 0 ? (
                  <>
                    <p className="text-xs italic text-gray-600 mb-4 truncate w-full">
                      "Oh! New Property"
                    </p>
                    <span className="flex items-center gap-2 mt-2 text-md font-semibold text-gray-800">
                      No reviews yet
                      <span className="flex">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Star key={i} filled={false} />
                        ))}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-xs italic text-gray-600 mb-4 truncate w-full">
                      "{reviews[currentIndex].publicReview}"
                    </p>
                    <span className="flex items-center gap-2 mt-2 text-md font-semibold text-gray-800">
                      {reviews[currentIndex].guestName}
                      <span className="flex">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Star key={i} filled={i < reviews[currentIndex].rating} />
                        ))}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
            {reviews.length > 0 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-transparent"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-3 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-transparent"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-3 h-6" />
                </button>
              </>
            )}
          </div>
          {reviews.length > 0 && (
            <div className="flex justify-center">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-1 mx-1 rounded ${
                    index === currentIndex ? 'bg-flex-green' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">All Reviews</h2>
            <div className="max-h-64 overflow-y-auto mb-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-600">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="mb-4">
                    <p className="text-sm font-semibold">{review.guestName}</p>
                    <p className="text-xs italic text-gray-600">"{review.publicReview}"</p>
                    <span className="flex">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Star key={i} filled={i < review.rating} />
                      ))}
                    </span>
                  </div>
                ))
              )}
            </div>
            <h3 className="text-md font-bold mb-2">Add Your Review</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.guestName}
              onChange={(e) => setNewReview({ ...newReview, guestName: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              placeholder="Your Review"
              value={newReview.publicReview}
              onChange={(e) => setNewReview({ ...newReview, publicReview: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <div className="flex mb-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Star
                  key={i}
                  filled={i < newReview.rating}
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 bg-flex-green text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSlideShow;