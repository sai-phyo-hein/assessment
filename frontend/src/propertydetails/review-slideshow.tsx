import React, { useEffect, useState } from 'react';
import Star from './star';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../global-store';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  guestName: string;
  publicReview: string;
  rating: number;
  reviewCategory?: string[];
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const categories = [
  'amenities',
  'check-in',
  'cleanliness',
  'communication',
  'environment',
  'living',
  'location',
  'service',
  'value',
];

const ReviewSlideShow: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    guestName: '',
    publicReview: '',
    rating: 0,
    categories: [] as string[],
    departureDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedProperty = useAppStore((state) => state.selectedProperty);
  const [propertyId, setPropertyId] = useState<number | null>(null);

  useEffect(() => {
    // Update propertyId if selectedProperty?.id is not null or undefined
    if (selectedProperty?.id != null) {
      setPropertyId(selectedProperty.id);
    }
    const fetchReviews = async () => {
      if (!selectedProperty?.id && selectedProperty?.id !== 0) {
        setLoading(false);
        setError('No property selected');
        return;
      }
      setLoading(true);
      setError(null);
      const url = `${BACKEND_URL}/reviews?propertyId=${selectedProperty.id}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Failed to fetch reviews: ${res.status} ${errorText}`
          );
        }
        const data = await res.json();

        // Filter to only show approved reviews
        const approvedReviews = data.filter(
          (review: any) => review.approved === true
        );
        setReviews(approvedReviews);
        setCurrentIndex(0);
      } catch (err: any) {
        console.error('Fetch Error:', err);
        setError(err.name === 'AbortError' ? 'Request timed out' : err.message);
      } finally {
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

  const handleCategoryChange = (category: string, checked: boolean) => {
    setNewReview((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const handleReviewSubmit = async () => {
    // Check for null or undefined
    if (propertyId == null) {
      setError('No property selected');
      return;
    }

    // Client-side validation
    if (!newReview.guestName.trim()) {
      setError('Guest name is required');
      return;
    }
    if (!newReview.publicReview.trim()) {
      setError('Review text is required');
      return;
    }
    if (newReview.rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (newReview.categories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setError(null); // Clear any previous errors
    setSubmitting(true);

    // Generate current datetime in the required format
    const now = new Date();
    const currentDateTime =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0') +
      ' ' +
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0') +
      ':' +
      String(now.getSeconds()).padStart(2, '0');

    try {
      const response = await fetch(`${BACKEND_URL}/addreviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: newReview.guestName,
          publicReview: newReview.publicReview,
          rating: newReview.rating,
          reviewCategory: newReview.categories,
          propertyId: propertyId,
          departureDate: currentDateTime,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(
          `Failed to submit review: ${response.status} ${errorText}`
        );
      }

      // Reset form
      setNewReview({
        guestName: '',
        publicReview: '',
        rating: 0,
        categories: [],
        departureDate: '',
      });
      setIsPopupOpen(false);
      setError(null); // Clear any previous errors

      // Refetch reviews
      const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        const url = `${BACKEND_URL}/reviews?propertyId=${propertyId}`;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(
              `Failed to fetch reviews: ${res.status} ${errorText}`
            );
          }
          const data = await res.json();
          // Filter to only show approved reviews
          const approvedReviews = data.filter(
            (review: any) => review.approved === true
          );
          setReviews(approvedReviews);
          setCurrentIndex(0);
        } catch (err: any) {
          setError(
            err.name === 'AbortError' ? 'Request timed out' : err.message
          );
        } finally {
          setLoading(false);
        }
      };
      fetchReviews();
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
      toast.success('Thank you for reviewing');
    }
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
            onClick={() => {
              setIsPopupOpen(true);
              setError(null); // Clear error when opening popup
            }}
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
                          <Star
                            key={i}
                            filled={i < reviews[currentIndex].rating}
                          />
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
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h2 className="text-lg font-bold mb-4">All Reviews</h2>
                <div className="max-h-96 overflow-y-auto mb-4">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-gray-600">No reviews yet.</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="mb-4">
                        <p className="text-sm font-semibold">
                          {review.guestName}
                        </p>
                        <p className="text-xs italic text-gray-600">
                          "{review.publicReview}"
                        </p>
                        <span className="flex">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <Star key={i} filled={i < review.rating} />
                          ))}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <h3 className="text-md font-bold mb-2">Add Your Review</h3>
                {error && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <label className="block text-sm font-medium mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newReview.guestName}
                  onChange={(e) =>
                    setNewReview({ ...newReview, guestName: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <label className="block text-sm font-medium mb-1">
                  Your Review *
                </label>
                <textarea
                  placeholder="Share your experience"
                  value={newReview.publicReview}
                  onChange={(e) =>
                    setNewReview({ ...newReview, publicReview: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <label className="block text-sm font-medium mb-1">
                  Rating *
                </label>
                <div className="flex mb-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Star
                      key={i}
                      filled={i < newReview.rating}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: i + 1 })
                      }
                    />
                  ))}
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Categories *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newReview.categories.includes(cat)}
                          onChange={(e) =>
                            handleCategoryChange(cat, e.target.checked)
                          }
                          className="mr-2"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">* Required fields</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    disabled={submitting}
                    className="px-4 py-2 bg-flex-green text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSlideShow;
