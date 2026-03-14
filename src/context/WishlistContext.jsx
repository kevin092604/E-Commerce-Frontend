import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];
    default:
      return state;
  }
};

export function WishlistProvider({ children }) {
  const [ids, dispatch] = useReducer(wishlistReducer, [], () => {
    try {
      const saved = localStorage.getItem("elite-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("elite-wishlist", JSON.stringify(ids));
  }, [ids]);

  const toggle = (id) => dispatch({ type: "TOGGLE", payload: id });
  const isWishlisted = (id) => ids.includes(id);

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
