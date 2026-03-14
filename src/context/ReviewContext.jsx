import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("elite-reviews");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("elite-reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((review) => {
    setReviews((prev) => [
      { ...review, id: Date.now(), date: new Date().toLocaleDateString("es-HN") },
      ...prev,
    ]);
  }, []);

  const getProductReviews = useCallback(
    (productId) => reviews.filter((r) => r.productId === productId),
    [reviews]
  );

  const getAverageRating = useCallback(
    (productId) => {
      const pr = reviews.filter((r) => r.productId === productId);
      if (!pr.length) return 0;
      return pr.reduce((acc, r) => acc + r.rating, 0) / pr.length;
    },
    [reviews]
  );

  return (
    <ReviewContext.Provider value={{ addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
}

export const useReviews = () => useContext(ReviewContext);
