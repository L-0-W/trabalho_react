import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx'; // Assuming Sidebar component exists
import styled from 'styled-components';

// Import necessary icons, removed EyeIcon as it's no longer needed
import {
  SearchIcon,
  HomeIcon,
  // EyeIcon, // Removed
  PlusIcon,
  BookOpenIcon,
  DownloadIcon,
  MessageSquareIcon,
  MenuIcon,
  XIcon,
  StarIcon,
  HeartIcon,
  UserIcon,
  ArrowLeftIcon,
  FilterIcon,
  ChevronDownIcon,
  BellIcon,
  CheckIcon,
  InfoIcon,
} from './components/items.jsx'; // Assuming icon components exist

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useParams,
} from 'react-router-dom';

// Assuming data files exist
import {
  allItemsData,
  allUsersData,
  popularReviewsData,
  recentReviews,
  reviews,
} from './components/data.jsx';

// --- ItemCard Component ---
const ItemCard = ({ item, isFavorite, onFavoriteToggle }) => {
  const rating = item.details?.averageRating;
  const navigate = useNavigate();
  const handleNavigateToDetails = () => navigate(`/item/${item.id}`);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700/50 flex flex-col group w-40 flex-shrink-0">
      {/* Image Section */}
      <div
        className="w-full h-48 bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer relative"
        onClick={handleNavigateToDetails}
      >
        <img
          src={item.img}
          alt={`Capa de ${item.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) =>
            (e.target.src =
              'https://placehold.co/200x300/cccccc/ffffff?text=Error')
          }
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Favorite Button & Rating */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating when clicking the button
            onFavoriteToggle(item.id);
          }}
          className={`absolute top-1 right-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow z-10 transition-colors ${
            isFavorite
              ? 'text-yellow-400'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          title={
            isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'
          }
          aria-label={
            isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'
          }
        >
          <StarIcon filled={isFavorite} className="w-3 h-3" />
          {typeof rating === 'number' && rating > 0 && (
            <span className="text-white">{rating.toFixed(1)}</span>
          )}
        </button>
      </div>
      {/* Title Section */}
      <div className="p-2 flex-grow flex flex-col justify-between">
        <h3
          className="font-semibold text-gray-200 text-xs leading-tight truncate cursor-pointer hover:text-green-400"
          title={item.title}
          onClick={handleNavigateToDetails}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
};

// --- StarRatingDisplay Component ---
const StarRatingDisplay = ({
  rating,
  size = 'text-lg',
  showTextRating = false,
}) => {
  // Handle cases where rating is explicitly 'NON' or undefined
  if (rating === 'NON' || typeof rating !== 'number' || rating < 0) {
    return <span className={`text-sm text-gray-500 ${size}`}>🥲 Sem Avaliações</span>;
  }

  const fullStars = Math.floor(rating);
  // No half star logic implemented here, only full and empty
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center text-yellow-400 ${size}`}>
        {/* Render full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`}>★</span>
        ))}
        {/* Render empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-600">
            ★
          </span>
        ))}
      </div>
      {/* Optionally display the numerical rating */}
      {showTextRating && (
        <span className="text-sm text-gray-400 font-semibold ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};


// --- RecentReviewCard Component ---
const RecentReviewCard = ({ item }) => {
  const navigate = useNavigate();
  // Early return if no recent reviews exist
  if (!item || recentReviews.length < 1) return null;

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700/50 flex gap-3 p-3 group cursor-pointer"
      onClick={() => navigate(`/item/${item.itemId}`)} // Navigate to item details on click
    >
      {/* Item Image */}
      <div className="w-16 h-auto aspect-[2/3] bg-gray-700 rounded flex-shrink-0 overflow-hidden">
        <img
          src={item.img}
          alt={`Capa de ${item.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) =>
            (e.target.src =
              'https://placehold.co/100x150/cccccc/ffffff?text=Error')
          }
        />
      </div>
      {/* Review Details */}
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-gray-200 text-sm truncate group-hover:text-green-400">
          {item.title}
        </h4>
        <div className="flex items-center mt-1">
          <StarRatingDisplay rating={item.rating} size="text-xs" />
          {/* User Link */}
          <span
            className="text-xs text-gray-400 ml-1.5 hover:text-white hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigating to item when clicking user
              navigate(`/profile/${item.userId}`);
            }}
          >
            por {item.user}
          </span>
        </div>
        {/* Review Text Snippet */}
        <p className="text-xs text-gray-300 mt-1.5 italic line-clamp-2">
          "{item.text}"
        </p>
      </div>
    </div>
  );
};

// --- PopularReviewCard Component ---
const PopularReviewCard = ({ review }) => {
  const navigate = useNavigate();
  return (
    <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700/50 flex gap-3 items-start">
      {/* Item Image */}
      <div
        className="w-12 h-auto aspect-[2/3] bg-gray-700 rounded flex-shrink-0 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/item/${review.itemId}`)} // Navigate to item
      >
        <img
          src={review.itemImg}
          alt={`Capa de ${review.itemTitle}`}
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.target.src =
              'https://placehold.co/50x75/cccccc/ffffff?text=Error')
          }
        />
      </div>
      {/* Review Content */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <div>
            {/* Review Context (Item and User Links) */}
            <p className="text-xs text-gray-400">
              Review de{' '}
              <strong
                onClick={() => navigate(`/item/${review.itemId}`)}
                className="text-gray-300 hover:underline cursor-pointer"
              >
                {review.itemTitle}
              </strong>{' '}
              por{' '}
              <strong
                onClick={() => navigate(`/profile/${review.userId}`)}
                className="text-gray-300 hover:underline cursor-pointer"
              >
                {review.user}
              </strong>
            </p>
            <StarRatingDisplay rating={review.rating} size="text-sm mt-0.5" />
          </div>
          {/* Likes Count */}
          <span className="flex items-center gap-1 text-xs text-green-400 bg-green-900/50 px-1.5 py-0.5 rounded-full border border-green-700/50 flex-shrink-0">
            <HeartIcon filled={true} className="w-3 h-3" /> {review.likes}
          </span>
        </div>
        {/* Review Text */}
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {review.text}
        </p>
      </div>
    </div>
  );
};

// --- UserSearchResultCard Component ---
const UserSearchResultCard = ({ user, isFollowing, onFollowToggle }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-700 transition-colors">
            {/* User Info & Link */}
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/profile/${user.id}`)} // Navigate to user profile
            >
                {/* Avatar Placeholder */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white shadow border border-gray-500">
                    {user.username.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-200 hover:text-green-400">
                    {user.username}
                </span>
            </div>
            {/* Follow/Unfollow Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    onFollowToggle(user.id);
                }}
                className={`text-xs font-semibold py-1 px-3 rounded-full transition-colors border ${
                    isFollowing
                        ? 'bg-green-600/20 text-green-300 border-green-600/50 hover:bg-green-600/30' // Style for "Following"
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-300 border-gray-500' // Style for "Follow"
                }`}
            >
                {isFollowing ? 'Seguindo' : 'Seguir'}
            </button>
        </div>
    );
};


// --- NotificationItem Component ---
const NotificationItem = ({ notification, onDismiss }) => {
    const navigate = useNavigate();
    // Find related item and user from data
    const item = allItemsData.find((i) => i.id === notification.itemId);
    const user = allUsersData.find((u) => u.id === notification.userId);

    // Don't render if item or user not found
    if (!item || !user) return null;

    // Navigate to item and dismiss notification
    const handleItemClick = () => {
        navigate(`/item/${item.id}`);
        onDismiss(notification.id);
    };

    // Navigate to user profile and dismiss notification
    const handleUserClick = (e) => {
        e.stopPropagation(); // Prevent item navigation
        navigate(`/profile/${user.id}`);
        onDismiss(notification.id);
    };

    return (
        <div
            className={`p-3 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer ${
                notification.read ? 'opacity-60' : '' // Dim read notifications
            }`}
            onClick={handleItemClick}
        >
            {/* Notification Text */}
            <p className="text-xs text-gray-400 mb-1">
                <strong
                    onClick={handleUserClick}
                    className="text-gray-200 hover:underline"
                >
                    {user.username}
                </strong>{' '}
                fez uma review de{' '}
                <strong className="text-gray-200 hover:underline">{item.title}</strong>
            </p>
            {/* Mark as Read Button (only if unread) */}
            {!notification.read && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent item navigation
                        onDismiss(notification.id);
                    }}
                    className="text-xxs text-blue-400 hover:text-blue-300 float-right ml-2"
                >
                    Marcar como lida
                </button>
            )}
        </div>
    );
};


// --- ItemSearchResult Component ---
const ItemSearchResult = ({ item }) => {
    const navigate = useNavigate();
    // Extract details safely
    const year = item.details?.year;
    const creator =
        item.type === 'book' ? item.details?.author : item.details?.director;

    return (
        <div
            className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer rounded-md"
            onClick={() => {
                // Check if item exists globally before adding (simple check)
                // Note: This might not be robust for large datasets or concurrent updates
                if (!allItemsData.find(existingItem => existingItem.id === item.id)) {
                     allItemsData.push(item); // Potentially add to global data (consider state management for this)
                     console.log('Adicionado item:', item.title);
                }
                navigate(`/item/${item.id}`); // Navigate to item details
            }}
        >
            {/* Item Image */}
            <img
                src={item.img}
                alt={`Capa de ${item.title}`}
                className="w-8 h-12 object-cover rounded flex-shrink-0 bg-gray-600"
                onError={(e) =>
                    (e.target.src = 'https://placehold.co/32x48/cccccc/ffffff?text=Err')
                }
            />
            {/* Item Title and Details */}
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-100 truncate">
                    {item.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                    {year} {creator && `• ${creator}`}
                </p>
            </div>
        </div>
    );
};

// --- HomePage Component ---
const HomePage = ({ items, favorites, onFavoriteToggle }) => {
  // State for search input, filters, and results
  const [inputValue, setInputValue] = useState('');
  const [activeFilters, setActiveFilters] = useState({}); // e.g., { autor: 'Tolkien', genero: 'Fantasia' }
  const [itemSearchResults, setItemSearchResults] = useState([]);
  const [showItemSearchDropdown, setShowItemSearchDropdown] = useState(false);
  const [dropdownBooks, setDropDownBooks] = useState([]); // Holds results from API

  // Refs for managing focus and clicks outside
  const itemSearchRef = useRef(null);
  const tagsContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Labels and colors for filter tags
  const filterLabels = { titulo: 'Título', autor: 'Autor', genero: 'Gênero' };
  const filterColors = {
    titulo: 'bg-gray-500 text-gray-100',
    autor: 'bg-blue-600 text-white',
    genero: 'bg-purple-600 text-white',
  };

  // Handle Enter key in search input to add filters
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.includes(':')) {
      event.preventDefault();
      const lowerValue = inputValue.toLowerCase();
      let filterType = null;
      let filterValue = '';

      // Check for filter prefixes
      if (lowerValue.startsWith('autor:')) filterType = 'autor';
      else if (lowerValue.startsWith('genero:')) filterType = 'genero';

      // Add filter if type and value are valid
      if (filterType) {
        filterValue = inputValue.substring(filterType.length + 1).trim();
        if (filterValue) {
          setActiveFilters((prev) => ({ ...prev, [filterType]: filterValue }));
          setInputValue(''); // Clear input after adding filter
          setShowItemSearchDropdown(false); // Hide dropdown
        }
      }
    } else if (
      // Handle Backspace key to remove the last filter if input is empty
      event.key === 'Backspace' &&
      inputValue === '' &&
      Object.keys(activeFilters).length > 0
    ) {
      const lastFilterKey = Object.keys(activeFilters).pop();
      if (lastFilterKey) removeFilter(lastFilterKey);
    }
  };

  // Remove a specific filter tag
  const removeFilter = (filterKey) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
    inputRef.current?.focus(); // Focus back on the input
  };

  // Process data from Google Books API
  const createNewBook = useCallback((data) => {
    const newBooks = [];
    if (data && data.items) {
      for (let i = 0; i < data.items.length; i++) {
        const book = data.items[i];
        const volumeInfo = book.volumeInfo || {};
        const saleInfo = book.saleInfo || {};
        const accessInfo = book.accessInfo || {};
        const pdfInfo = accessInfo.pdf || {};

        // Construct a standardized book object
        let newBook = {
          id: book.id, // Use Google Books ID
          type: 'book',
          title: volumeInfo.title || 'Título Desconhecido',
          img: volumeInfo.imageLinks?.smallThumbnail || volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/100x150/cccccc/ffffff?text=No+Cover',
          details: {
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor Desconhecido',
            pages: volumeInfo.pageCount,
            description: volumeInfo.description || 'Sem descrição.',
            genres: volumeInfo.categories || ['Sem Categoria'],
            averageRating: volumeInfo.averageRating || 'NON', // Use 'NON' for no rating
            ratingsCount: volumeInfo.ratingsCount || 0,
            year: volumeInfo.publishedDate ? parseInt(volumeInfo.publishedDate.split('-')[0], 10) : 'Sem Data',
            publisher: volumeInfo.publisher,
            availability: {
              onlineStoreUrl: saleInfo.buyLink,
              libraryUrl: accessInfo.webReaderLink,
              // Simplified download logic - check accessViewStatus
              downloadUrl: accessInfo.accessViewStatus !== 'NONE' ? pdfInfo.acsTokenLink || pdfInfo.downloadLink : undefined,
            },
            // similarBooks: [], // Placeholder for similar books feature
          },
          popular: (volumeInfo.ratingsCount || 0) > 50, // Define 'popular' based on ratings count
        };
        newBooks.push(newBook);
      }
    }
    setDropDownBooks(newBooks); // Update state with processed books
  }, []); // Empty dependency array as it doesn't depend on component state/props directly


  // Fetch books from Google Books API based on search term and filters
  const fetchBooksFromAPI = useCallback(async (searchTerm, filters) => {
      try {
          let queryParts = [];
          if (searchTerm) {
              // Basic query term (title, general keywords)
              queryParts.push(searchTerm.replace(/[^a-z0-9\s]+/gi, '').trim()); // Sanitize basic term
          }

          // Add specific filters from activeFilters state
          if (filters.autor) {
              queryParts.push(`inauthor:"${filters.autor.trim()}"`); // Use exact phrase for author
          }
          if (filters.genero) {
              queryParts.push(`subject:"${filters.genero.trim()}"`); // Use exact phrase for subject/genre
          }

          if (queryParts.length === 0) {
             setDropDownBooks([]); // No query, clear results
             setShowItemSearchDropdown(false);
             return;
          }

          const combinedQuery = queryParts.join('+'); // Combine parts with '+' for URL encoding

          // Construct the API URL
          const url = `https://www.googleapis.com/books/v1/volumes?q=${combinedQuery}&orderBy=relevance&maxResults=12&startIndex=0`;
          console.log("Fetching URL:", url); // Log the URL for debugging

          const response = await fetch(url);
          if (!response.ok) {
              console.error('Erro ao buscar livros:', response.statusText);
              setDropDownBooks([]); // Clear results on error
              setShowItemSearchDropdown(false);
              return;
          }

          const data = await response.json();
          createNewBook(data); // Process the fetched data
          setShowItemSearchDropdown(data.items && data.items.length > 0); // Show dropdown if results exist

      } catch (e) {
          console.error("Erro na requisição da API:", e);
          setDropDownBooks([]); // Clear results on exception
          setShowItemSearchDropdown(false);
      }
  }, [createNewBook]); // Dependency: createNewBook function


  // Effect to trigger API fetch when input or filters change
  useEffect(() => {
    const currentInputTerm = inputValue.toLowerCase().trim();
    // Use a debounce mechanism to avoid fetching on every keystroke
    const handler = setTimeout(() => {
      if (currentInputTerm || Object.keys(activeFilters).length > 0) {
        fetchBooksFromAPI(currentInputTerm, activeFilters);
      } else {
        // Clear results if both input and filters are empty
        setDropDownBooks([]);
        setShowItemSearchDropdown(false);
      }
    }, 300); // Debounce delay of 300ms

    // Cleanup function to cancel the timeout if dependencies change before it executes
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, activeFilters, fetchBooksFromAPI]); // Dependencies: input, filters, and the fetch function itself


  // Effect to handle clicks outside the search dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemSearchRef.current && !itemSearchRef.current.contains(event.target)) {
        setShowItemSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array, runs once on mount

  // Filter local items data for the "Popular" section (example logic)
  const popularItems = items.filter((item) => item.popular);

  // CSS for the scrolling animation
  const scrollAnimationStyle = `
    @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
    .animate-scroll-left { animation: scroll-left 60s linear infinite; }
    .pause-on-hover:hover .animate-scroll-left { animation-play-state: paused; }
  `;

  return (
    <div className="space-y-10 mb-10">
      <style>{scrollAnimationStyle}</style>

      {/* --- Search Section --- */}
      <div className="mb-6" ref={itemSearchRef}>
        <h2 className="text-xl font-semibold text-white mb-3">
          Encontre um Livro, Filme...
        </h2>
        {/* Search Input and Filter Tags Container */}
        <div className="relative flex items-center w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-green-500 shadow-md">
          <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mr-2" />
          {/* Active Filter Tags */}
          <div ref={tagsContainerRef} className="flex items-center gap-1 flex-wrap mr-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <span
                key={key}
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${filterColors[key]}`}
              >
                {filterLabels[key]}: {value}
                {/* Remove Filter Button */}
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 opacity-70 hover:opacity-100 focus:outline-none"
                  aria-label={`Remover filtro ${filterLabels[key]}`}
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {/* Search Input Field */}
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => dropdownBooks.length > 0 && setShowItemSearchDropdown(true)} // Show dropdown on focus if results exist
            placeholder={'Título, autor:Nome, genero:Nome...'}
            className="flex-grow p-0 bg-transparent border-none text-gray-100 focus:ring-0 focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>
        {/* Search Results Dropdown */}
        {showItemSearchDropdown && dropdownBooks.length > 0 && (
          <div className="relative w-full">
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-30 max-h-72 overflow-y-auto">
              <div className="p-2 space-y-1">
                {dropdownBooks.map((item) => (
                  <ItemSearchResult key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Popular Items Section --- */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Populares da Semana
        </h2>
        <div className="overflow-hidden w-full relative group pause-on-hover">
          {/* Scrolling Container */}
          <div className="flex animate-scroll-left whitespace-nowrap">
            {/* Render popular items twice for seamless loop */}
            {popularItems.map((item) => (
              <div key={item.id} className="inline-block px-2">
                <ItemCard
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  onFavoriteToggle={onFavoriteToggle}
                />
              </div>
            ))}
            {popularItems.map((item) => (
              <div key={`${item.id}-duplicate`} className="inline-block px-2">
                <ItemCard
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  onFavoriteToggle={onFavoriteToggle}
                />
              </div>
            ))}
          </div>
          {/* Message if no popular items */}
          {popularItems.length === 0 && (
            <p className="text-gray-500 text-center py-5">
              Nenhum item popular encontrado localmente.
            </p>
          )}
        </div>
      </div>

      {/* --- Recent Reviews Section --- */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Reviews Recentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentReviews.slice(0, 4).map((item) => ( // Limit to first 4 recent reviews
            <RecentReviewCard key={item.id} item={item} />
          ))}
          {recentReviews.length === 0 && (
            <p className="text-gray-500">Nenhuma review recente.</p>
          )}
        </div>
      </div>

      {/* --- Popular Reviews Section --- */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Reviews Populares
        </h2>
        <div className="space-y-4">
          {popularReviewsData.slice(0, 5).map((review) => ( // Limit to first 5 popular reviews
            <PopularReviewCard key={review.id} review={review} />
          ))}
          {popularReviewsData.length === 0 && (
            <p className="text-gray-500">Nenhuma review popular.</p>
          )}
        </div>
      </div>
    </div>
  );
};


// --- FavoritesPage Component ---
const FavoritesPage = ({ items, favorites, onFavoriteToggle }) => {
  // Filter the main items list to get only the favorited items
  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">
        Meus Favoritos
      </h1>
      {/* Check if there are any favorite items */}
      {favoriteItems.length > 0 ? (
        // Display favorite items in a grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoriteItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorite={true} // All items here are favorites
              onFavoriteToggle={onFavoriteToggle} // Pass the toggle function
            />
          ))}
        </div>
      ) : (
        // Display a message if there are no favorites
        <p className="text-gray-400 text-center py-10">
          Você ainda não adicionou favoritos. Clique na estrela ★ em um item para adicioná-lo.
        </p>
      )}
    </div>
  );
};


// --- Styled Components for Popup ---
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); // Semi-transparent dark background
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // High z-index to be on top
  backdrop-filter: blur(5px); // Optional blur effect
`;

const PopupContainer = styled.div`
  background-color: #1f2937; // Dark background (Tailwind gray-800)
  color: #d1d5db; // Light text color (Tailwind gray-300)
  padding: 24px;
  border-radius: 8px;
  width: 90%; // Responsive width
  max-width: 500px; // Max width
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid #374151; // Tailwind gray-700 border
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #9ca3af; // Tailwind gray-400
  font-size: 1.5rem; // Larger close icon
  line-height: 1;
  cursor: pointer;
  padding: 5px;
  &:hover {
    color: #e5e7eb; // Tailwind gray-200 on hover
  }
`;

const InfoItem = styled.p`
  margin-bottom: 12px;
  font-size: 1rem;
  color: #d1d5db; // Tailwind gray-300
  strong {
    color: #f9fafb; // Tailwind gray-50 for labels
  }
`;

// --- UserInfoPopup Component ---
const UserInfoPopup = ({ user, setShowInfo, showInfo }) => {
  // Prevent background scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle closing the popup
  const handleClose = () => setShowInfo(false);

  // Handle clicks outside the popup to close it
  const handleOverlayClick = (e) => {
    // Check if the click target is the overlay itself
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <PopupOverlay onClick={handleOverlayClick}> {/* Close on overlay click */}
      <PopupContainer onClick={(e) => e.stopPropagation()}> {/* Prevent closing on container click */}
        <CloseButton onClick={handleClose} aria-label="Fechar popup">&times;</CloseButton>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">
          Informações do Usuário
        </h2>
        {/* Display user information */}
        <InfoItem><strong>Username:</strong> {user.username}</InfoItem>
        {user.email && <InfoItem><strong>Email:</strong> {user.email}</InfoItem>}
        {user.born_in && <InfoItem><strong>Data de Nascimento:</strong> {user.born_in}</InfoItem>}
        {user.gender && <InfoItem><strong>Gênero:</strong> {user.gender}</InfoItem>}
        {/* Add more fields as needed */}
      </PopupContainer>
    </PopupOverlay>
  );
};


// --- ProfilePage Component ---
const ProfilePage = ({ currentUser, favorites, following, onFollowToggle }) => {
  const { userId } = useParams(); // Get userId from URL params
  const [showInfo, setShowInfo] = useState(false); // State for info popup
  const navigate = useNavigate();

  // Determine if viewing own profile or another user's
  const isOwnProfile = !userId || userId === currentUser.id;
  const userToDisplay = isOwnProfile
    ? currentUser
    : allUsersData.find((u) => u.id === userId); // Find user data if not own profile

  // State for the active tab ('favorites' or 'reviews')
  const [activeTab, setActiveTab] = useState(isOwnProfile ? 'favorites' : 'reviews'); // Default to favorites for own, reviews for others

  // Early return if user not found
  if (!userToDisplay) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-white mb-6">Erro</h1>
        <p className="text-gray-400">Usuário não encontrado.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" /> Voltar para Início
        </button>
      </div>
    );
  }

  // Aggregate profile data for the user being displayed
  const userProfileData = {
    ...userToDisplay,
    // Removed readCount and readItems
    favoritesCount: isOwnProfile ? favorites.length : 0, // Only show own favorites count
    reviewsCount: reviews.filter((r) => r.userId === userToDisplay.id).length,
    followersCount: allUsersData.filter((u) => u.following?.includes(userToDisplay.id)).length,
    followingCount: userToDisplay.following?.length || 0,
    // Removed readItems
    reviews: popularReviewsData.filter((r) => r.userId === userToDisplay.id), // Get user's reviews
  };

  // Check if the current user is following the displayed user
  const isCurrentlyFollowing = following.includes(userToDisplay.id);

  // --- ItemGrid Component (for Favorites) ---
  const ItemGrid = ({ itemIds }) => {
    // Filter all items to get only those whose IDs are in the provided list
    const itemsToShow = allItemsData.filter((item) => itemIds.includes(item.id));
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {itemsToShow.map((item) => (
          // Individual item card in the grid
          <div
            key={item.id}
            className="bg-gray-800 rounded shadow overflow-hidden cursor-pointer group border border-gray-700/50 relative transition-transform transform hover:scale-105"
            onClick={() => navigate(`/item/${item.id}`)} // Navigate to item details on click
            title={`${item.title}`} // Tooltip with item title
          >
            {/* Item Image */}
            <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={item.img}
                alt={`Capa de ${item.title}`}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                onError={(e) =>
                  (e.target.src =
                    'https://placehold.co/150x225/cccccc/ffffff?text=Error')
                }
              />
            </div>
          </div>
        ))}
        {/* Message if no items to show */}
        {itemsToShow.length === 0 && (
          <p className="text-gray-500 italic col-span-full text-center py-5">
            Nenhum item para exibir nesta seção.
          </p>
        )}
      </div>
    );
  };


  // --- Render Content based on Active Tab ---
  const renderContent = () => {
    switch (activeTab) {
      case 'favorites':
        // Show favorites only if it's the user's own profile
        return isOwnProfile ? (
          <ItemGrid itemIds={favorites} />
        ) : (
          <p className="text-gray-500 italic text-center py-5">
            Favoritos são privados.
          </p>
        );
      case 'reviews':
        // Display the user's reviews
        return (
          <div className="space-y-4">
            {userProfileData.reviews.map((review, index) => {
              // Find the item associated with the review
              const reviewedItem = allItemsData.find(
                (item) => item.id === review.itemId
              );
              return (
                // Individual review card
                <div
                  key={index}
                  className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/50 flex gap-3 items-start"
                >
                  {/* Reviewed Item Image (if found) */}
                  {reviewedItem && (
                    <div
                      className="w-12 h-auto aspect-[2/3] bg-gray-700 rounded flex-shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/item/${reviewedItem.id}`)} // Link to item
                    >
                      <img
                        src={reviewedItem.itemImg || reviewedItem.img} // Use review image or item image
                        alt={`Capa de ${review.itemTitle}`}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src =
                            'https://placehold.co/50x75/cccccc/ffffff?text=Error')
                        }
                      />
                    </div>
                  )}
                  {/* Review Details */}
                  <div className="flex-grow">
                    <p
                      className="font-semibold text-gray-200 text-sm mb-1 hover:underline cursor-pointer"
                      onClick={() =>
                        reviewedItem && navigate(`/item/${reviewedItem.id}`) // Link to item
                      }
                    >
                      {review.itemTitle}
                    </p>
                    <StarRatingDisplay rating={review.rating} size="text-sm" />
                    <p className="text-sm text-gray-300 mt-2">{review.text}</p>
                  </div>
                </div>
              );
            })}
            {/* Message if no reviews */}
            {userProfileData.reviews.length != 0 && (
              <p className="text-gray-500 italic text-center py-5">
                Nenhuma review encontrada.
              </p>
            )}
          </div>
        );
      default:
        return null; 
    }
  };


  // --- Main Profile Page JSX ---
  return (
    <div className="text-gray-300">
      {/* Render User Info Popup if showInfo is true */}
      {showInfo && (
        <UserInfoPopup user={userProfileData} setShowInfo={setShowInfo} showInfo={showInfo} />
      )}

      {/* Back Button (only shown when viewing another user's profile) */}
      {!isOwnProfile && (
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Voltar
        </button>
      )}

      {/* Profile Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 border-b border-gray-700 pb-6">
        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-2 border-gray-600">
          {userProfileData.username.charAt(0)}
        </div>
        {/* User Info and Actions */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
            {/* Username and Info Button */}
            <h1 className="text-2xl sm:text-3xl gap-2 font-bold text-white flex items-center">
              {userProfileData.username}
              {/* Info icon to open the popup */}
              <button onClick={() => setShowInfo(true)} className="ml-2 text-gray-400 hover:text-white" title="Ver informações do usuário">
                <InfoIcon className="w-5 h-5" />
              </button>
            </h1>
            {/* Action Button: Edit Profile (own) or Follow/Unfollow (others) */}
            {isOwnProfile ? (
              <button className="mt-2 sm:mt-0 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold py-1.5 px-4 rounded-lg transition-colors border border-gray-600">
                Editar Perfil
              </button>
            ) : (
              <button
                onClick={() => onFollowToggle(userToDisplay.id)}
                className={`mt-2 sm:mt-0 text-xs font-semibold py-1.5 px-4 rounded-full transition-colors border ${
                  isCurrentlyFollowing
                    ? 'bg-green-600/20 text-green-300 border-green-600/50 hover:bg-green-600/30' // Following style
                    : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500' // Follow style
                }`}
              >
                {isCurrentlyFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            )}
          </div>
          {/* User Bio */}
          <p className="text-gray-400 text-sm mt-1 mb-2 max-w-xl">
            {userProfileData.bio || 'Sem bio.'}
          </p>
          {/* User Stats */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
            {/* Removed Lidos count */}
            {/* Favorites Count (only for own profile) */}
            {isOwnProfile && (
              <span>
                <strong className="text-gray-200">
                  {userProfileData.favoritesCount}
                </strong>{' '}
                Favoritos
              </span>
            )}
            {/* Reviews Count */}
            <span>
              <strong className="text-gray-200">
                {userProfileData.reviewsCount}
              </strong>{' '}
              Reviews
            </span>
            {/* Following Count */}
            <span className="cursor-pointer hover:text-white">
              <strong className="text-gray-200">
                {userProfileData.followingCount}
              </strong>{' '}
              Seguindo
            </span>
            {/* Followers Count */}
            <span className="cursor-pointer hover:text-white">
              <strong className="text-gray-200">
                {userProfileData.followersCount}
              </strong>{' '}
              Seguidores
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-700 mb-6 overflow-x-auto">
        {/* Dynamically create tabs: Favorites (if own profile) and Reviews */}
        {[...(isOwnProfile ? ['favorites'] : []), 'reviews'].map(
          (tabId) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)} // Set active tab on click
              className={`py-2 px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tabId
                  ? 'text-white border-b-2 border-green-500' // Active tab style
                  : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent' // Inactive tab style
              }`}
            >
              {/* Capitalize tab ID for display */}
              {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
              {/* Display count for the tab */}
              <span className="ml-1 text-xs text-gray-500">
                (
                {tabId === 'favorites'
                  ? userProfileData.favoritesCount
                  : tabId === 'reviews'
                  ? userProfileData.reviewsCount
                  : 0}
                )
              </span>
            </button>
          )
        )}
      </div>

      {/* Render Content Area based on active tab */}
      <div> {renderContent()} </div>
    </div>
  );
};


// --- ReviewCard Component ---
const ReviewCard = ({ review }) => {
  const navigate = useNavigate();
  // Find the user who wrote the review
  const user = allUsersData.find((u) => u.id === review.userId);
  // State to track if the current user has liked this review
  const [isLiked, setLiked] = useState(false); // Default to not liked
  const [likeCount, setLikeCount] = useState(review.likes || 0); // Local like count state

  // Function to handle liking/unliking a review
  const handleLikeToggle = () => {
    // Toggle the liked state
    const newLikedState = !isLiked;
    setLiked(newLikedState);

    // Update the local like count based on the new state
    setLikeCount((prevCount) => newLikedState ? prevCount + 1 : prevCount - 1);

    // --- Important Note on Data Persistence ---
    // This only updates the local state (`isLiked`, `likeCount`) and potentially
    // the `popularReviewsData` array *in memory*.
    // For real applications, you would need to:
    // 1. Send an API request to your backend to record the like/unlike action.
    // 2. Update the review data source (e.g., `reviews` array or fetch updated data)
    //    to reflect the change persistently.
    // The current logic for updating `popularReviewsData` is basic and might
    // not be robust or correctly reflect real-time popularity changes.

    // Example: Basic update to popularReviewsData (consider better state management)
    const popularIndex = popularReviewsData.findIndex(r => r.id === review.id);
    if (newLikedState) {
        // If liked and not already popular, potentially add it (simple logic)
        if (popularIndex === -1 && likeCount + 1 > 10) { // Example threshold: 10 likes
             // Ensure likes count is updated before pushing
             const updatedReview = { ...review, likes: likeCount + 1 };
            // popularReviewsData.push(updatedReview); // Mutating global data directly - avoid if possible
            console.log("Review potentially added to popular:", updatedReview.id);
        } else if (popularIndex !== -1) {
            // If already popular, update its like count in the popular array
            // popularReviewsData[popularIndex].likes = likeCount + 1; // Mutating - avoid
             console.log("Popular review likes updated:", review.id);
        }
    } else {
        // If unliked and was popular, potentially remove or just update count
        if (popularIndex !== -1) {
            // popularReviewsData[popularIndex].likes = likeCount - 1; // Mutating - avoid
            // Optionally remove if likes drop below threshold
             console.log("Popular review likes updated:", review.id);
        }
    }
     console.log("Updated Popular Reviews (example):", popularReviewsData.map(r => ({id: r.id, likes: r.likes})));
  };


  return (
    <div className="flex gap-4 py-4 border-b border-gray-700/50">
      {/* User Avatar */}
      <div
        className="flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/profile/${review.userId}`)} // Link to user profile
      >
        <img
          src={
            user?.avatar || // Use user avatar if available
            `https://placehold.co/40x40/777/ffffff?text=${review.user.charAt(0)}` // Fallback to initial
          }
          alt={`Avatar de ${review.user}`}
          className="w-10 h-10 rounded-full border-2 border-gray-600"
          onError={(e) => // Fallback for image loading error
            (e.target.src = `https://placehold.co/40x40/777/ffffff?text=${review.user.charAt(
              0
            )}`)
          }
        />
      </div>
      {/* Review Content */}
      <div className="flex-grow">
        {/* Review Metadata (User, Rating) */}
        <div className="flex items-center gap-2 mb-1 text-sm">
          <span className="text-gray-400">Review por</span>
          <strong
            className="text-gray-200 hover:text-white cursor-pointer"
            onClick={() => navigate(`/profile/${review.userId}`)} // Link to user profile
          >
            {review.user}
          </strong>
          <StarRatingDisplay rating={review.rating} size="text-xs" />
        </div>
        {/* Review Text */}
        <p className="text-gray-300 text-sm leading-relaxed mb-2">
          {review.text}
        </p>
        {/* Action Buttons (Like, Comment Count) */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {/* Like Button */}
          <button
             onClick={handleLikeToggle} // Use the updated handler
             className={`flex items-center gap-1 transition-colors ${
                 isLiked ? 'text-red-500 hover:text-red-400' : 'hover:text-red-400'
             }`}
          >
            <HeartIcon filled={isLiked} className="w-3.5 h-3.5" />
            {likeCount} {/* Display local like count */}
          </button>
          {/* Comment Count (Display only) */}
          <button className="flex items-center gap-1 hover:text-white transition-colors cursor-default"> {/* Make non-interactive for now */}
            <MessageSquareIcon className="w-3.5 h-3.5" />
            {review.commentsCount || 0}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- SimilarItemsSection Component ---
const SimilarItemsSection = ({
  title,          // Title for the section (e.g., "Livros Semelhantes")
  itemIds,        // Array of IDs for similar items
  currentItemId,  // ID of the item currently being viewed (to exclude it)
  onFavoriteToggle, // Function to handle favoriting/unfavoriting
  favorites,      // Array of current user's favorite item IDs
}) => {
  // Filter the global item data to find similar items, excluding the current one
  const similarItems = allItemsData.filter(
    (item) => itemIds.includes(item.id) && item.id !== currentItemId
  );

  // If no similar items are found (after filtering), don't render the section
  if (similarItems.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">{title}</h3>
      {/* Horizontal scrolling container */}
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {/* Map through the similar items and render an ItemCard for each */}
        {similarItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            // Check if the similar item is in the user's favorites
            isFavorite={favorites.includes(item.id)}
            onFavoriteToggle={onFavoriteToggle} // Pass down the toggle function
          />
        ))}
      </div>
    </div>
  );
};


// --- DetailsPage Component ---
const DetailsPage = ({
  items,            // All available items data
  favorites,        // Current user's favorite item IDs
  onFavoriteToggle, // Function to toggle favorite status
  currentUser,      // Data of the logged-in user
  addNotification,  // Function to add a notification
}) => {
  const { itemId } = useParams(); // Get item ID from URL parameters
  const navigate = useNavigate(); // Hook for navigation

  // Find the specific item data based on the itemId from the URL
  const item = items.find((i) => i.id === itemId);

  // --- State Variables ---
  // Removed isRead state
  const [isLiked, setIsLiked] = useState(false); // Track if the item is liked by the user
  const [isInList, setIsInList] = useState(false); // Track if the item is added to a custom list (placeholder)
  const [userRating, setUserRating] = useState(0); // User's star rating for the item (0 = not rated)
  const [reviewText, setReviewText] = useState(''); // Text content of the user's review
  const [showReviewForm, setShowReviewForm] = useState(false); // Controls visibility of the review popup

  // Filter reviews specific to this item
  const itemReviews = reviews.filter((r) => r.itemId === itemId);
  // Further filter for popular reviews (example: more than 50 likes) and sort them
  const popularItemReviews = itemReviews
    .filter((r) => (r.likes || 0) > 50) // Ensure likes exist before comparing
    .sort((a, b) => (b.likes || 0) - (a.likes || 0)); // Sort by likes descending

  // --- Effects ---
  // Reset local state when the itemId changes (navigating to a different item)
  useEffect(() => {
    // Removed setIsRead(false)
    setIsLiked(false); // Reset like status
    setIsInList(false); // Reset list status
    setUserRating(0); // Reset rating
    setReviewText(''); // Clear review text
    setShowReviewForm(false); // Hide review form
    window.scrollTo(0, 0); // Scroll to top of the page
  }, [itemId]); // Dependency: run effect when itemId changes

  // Removed useEffect for setting initial isRead state

  // --- Event Handlers ---
  // Removed handleToggleRead function

  // Toggle the 'liked' status (simple toggle, no backend interaction here)
  const handleToggleLike = () => {
      setIsLiked(!isLiked);
      // In a real app, you'd also send this update to a backend API.
      console.log("Like status toggled for item:", itemId, !isLiked);
  };

  // Toggle the 'in list' status (placeholder functionality)
  const handleToggleList = () => {
      setIsInList(!isInList);
      // Placeholder: Add logic for adding/removing from a user-specific list
      console.log("List status toggled for item:", itemId, !isInList);
  };


  // Open the review form popup
  const handleOpenReviewForm = () => setShowReviewForm(true);

  // Handle the submission of the review form
  const handleSubmitReview = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Basic validation: ensure a rating is selected
    if (userRating === 0) {
      // Replace alert with a more user-friendly notification if possible
      alert('Por favor, selecione uma nota (estrelas).');
      return;
    }

    // Construct the new review object
    const newReviewData = {
      userId: currentUser.id,
      user: currentUser.username,
      itemId: item.id,
      itemTitle: item.title,
      itemImg: item.img, // Use the main item image for the review card
      rating: userRating,
      text: reviewText.trim(), // Trim whitespace from review text
      likes: 0, // Initialize likes to 0
      commentsCount: 0, // Initialize comments to 0
      id: `r${Date.now()}`, // Generate a simple unique ID (use UUID in production)
      timestamp: new Date().toISOString(), // Add a timestamp
      // Added img property matching item.img for consistency if needed elsewhere
      img: item.img,
    };

    // --- Data Update (Important Considerations) ---
    // The following lines directly mutate global arrays (`reviews`, `recentReviews`).
    // This is generally discouraged in React. Instead, use state management
    // (like Context API, Zustand, Redux) or pass update functions down as props.
    // For this example, we'll keep the direct mutation for simplicity.
    reviews.unshift(newReviewData); // Add to the beginning of the main reviews list
    recentReviews.unshift(newReviewData); // Add to the beginning of recent reviews
    // Keep recentReviews array trimmed if needed (e.g., max 10 items)
    if (recentReviews.length > 10) {
        recentReviews.pop();
    }
    console.log("New review submitted:", newReviewData);
    console.log("Updated Reviews Array:", reviews);
    console.log("Updated Recent Reviews Array:", recentReviews);
    // --- End Data Update Note ---

    // Add a notification for followers (if applicable)
    addNotification({
      type: 'new_review',
      userId: currentUser.id,
      itemId: item.id,
    });

    // Close the form and reset state
    setShowReviewForm(false);
    setUserRating(0);
    setReviewText('');
  };


  // --- Render Logic ---
  // Show loading or error message if item data is not yet available
  if (!item) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-white mb-4">
          404 - Item Não Encontrado
        </h1>
        <p className="text-gray-400 mb-6">O item que você está procurando não existe ou foi movido.</p>
        <Link to="/" className="text-green-400 hover:underline font-semibold">
          Voltar para Início
        </Link>
      </div>
    );
  }

  // Destructure item details safely, providing defaults
  const {
    author = 'Autor Desconhecido',
    pages,
    publisher,
    availability = {}, // Default to empty object if not present
    genres = [],       // Default to empty array
    description = 'Sem descrição disponível.',
    year = 'Ano Desconhecido',
    averageRating = 'NON', // Use 'NON' for no rating
    ratingsCount = 0,
  } = item.details || {}; // Use empty object if item.details is missing

  const { title, img, similarBooks = [] } = item; // Destructure main item properties

  // --- JSX Structure ---
  return (
    <div className="text-gray-300">
      {/* Header Background Image/Gradient */}
      <div className="h-40 md:h-64 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg mb-[-60px] md:mb-[-80px] relative z-0 overflow-hidden">
        {/* Optional: Use item image as blurred background */}
        <img
          src={img}
          alt="" // Alt text is empty as it's decorative
          className="object-cover w-full h-full opacity-30 blur-sm"
          onError={(e) => e.target.style.display = 'none'} // Hide if image fails
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 px-4 md:px-0">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Go back to previous page
          className="absolute top-[-40px] left-0 md:left-[-50px] bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white p-1.5 rounded-full backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Voltar"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* Layout: Sidebar (Left) and Main Info (Right) */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* --- Left Sidebar (Sticky) --- */}
          <div className="w-full md:w-1/4 flex-shrink-0 mt-[-20px] md:mt-0">
            <div className="sticky top-20"> {/* Makes the sidebar sticky */}
              {/* Item Cover Image */}
              <div className="w-full aspect-[2/3] bg-gray-700 rounded-lg shadow-lg mb-4 border-2 border-gray-600 overflow-hidden">
                <img
                  src={img}
                  alt={`Capa de ${title}`}
                  className="object-cover w-full h-full"
                  onError={(e) =>
                    (e.target.src =
                      'https://placehold.co/300x450/cccccc/ffffff?text=Error')
                  }
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {/* Removed "Lido" Button */}
                {/* Like Button */}
                <button
                  onClick={handleToggleLike}
                  title="Gostar / Desgostar"
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-colors border ${
                    isLiked
                      ? 'bg-red-600/20 text-red-400 border-red-600/50' // Liked style
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' // Default style
                  }`}
                >
                  <HeartIcon filled={isLiked} className="w-4 h-4" /> Gostar
                </button>
                {/* Add to List Button (Placeholder) */}
                <button
                  onClick={handleToggleList}
                  title="Adicionar à Lista / Remover"
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-colors border ${
                    isInList
                      ? 'bg-blue-600/20 text-blue-400 border-blue-600/50' // In list style
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' // Default style
                  }`}
                >
                  <PlusIcon className="w-4 h-4" /> Lista
                </button>
              </div>

              {/* Review Button */}
              <button
                onClick={handleOpenReviewForm}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm mb-4 shadow"
              >
                Avaliar ou Escrever Review
              </button>

              {/* Review Form Popup/Modal */}
              {showReviewForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"> {/* Added animation */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative border border-gray-700">
                    {/* Close Button */}
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-white"
                      aria-label="Fechar formulário de review"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                    {/* Form Title */}
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Sua Avaliação para "{title}"
                    </h3>
                    {/* Review Form */}
                    <form onSubmit={handleSubmitReview}>
                      {/* Star Rating Input */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button" // Important: type="button" to prevent form submission
                            onClick={() => setUserRating(star)}
                            className={`text-4xl transition-transform transform hover:scale-110 duration-150 focus:outline-none ${
                              userRating >= star
                                ? 'text-yellow-400' // Selected star color
                                : 'text-gray-600 hover:text-gray-500' // Unselected star color
                            }`}
                            title={`Avaliar ${star} estrela${star > 1 ? 's' : ''}`}
                            aria-label={`Avaliar ${star} estrela${star > 1 ? 's' : ''}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      {/* Review Text Area */}
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Escreva sua review (opcional)..."
                        rows="5"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-1 focus:ring-purple-500 focus:outline-none text-sm placeholder-gray-500 mb-4"
                        // Optionally disable if no rating is given yet
                        // disabled={userRating === 0}
                      ></textarea>
                      {/* Form Actions */}
                      <div className="flex justify-end gap-3">
                        <button
                          type="button" // Cancel button
                          onClick={() => setShowReviewForm(false)}
                          className="text-gray-400 hover:text-white text-sm px-4 py-1.5 rounded"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit" // Submit button
                          disabled={userRating === 0} // Disable if no rating selected
                          className={`bg-green-600 hover:bg-green-500 text-white font-semibold text-sm py-1.5 px-4 rounded-lg transition-colors shadow ${
                            userRating === 0
                              ? 'opacity-50 cursor-not-allowed' // Style when disabled
                              : ''
                          }`}
                        >
                          Salvar Avaliação
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Availability Links (Read Online / Download) */}
              <div className="flex items-center gap-2">
                {/* Read Online Link */}
                {availability.libraryUrl && ( // Check if libraryUrl exists
                  <a
                    href={availability.libraryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold py-2 px-3 rounded-md transition-colors border border-gray-600 inline-flex items-center justify-center gap-1.5"
                  >
                    <BookOpenIcon className="w-4 h-4" /> Ler Online
                  </a>
                )}
                {/* Download Link */}
                {availability.downloadUrl && ( // Check if downloadUrl exists
                  <a
                    href={availability.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold py-2 px-3 rounded-md transition-colors border border-gray-600 inline-flex items-center justify-center gap-1.5"
                  >
                    <DownloadIcon className="w-4 h-4" /> Download
                  </a>
                )}
              </div>
                 {/* Message if no links available */}
                 {!availability.libraryUrl && !availability.downloadUrl && (
                    <p className="text-xs text-gray-500 text-center mt-2 italic">Nenhum link de leitura/download disponível.</p>
                )}
            </div>
          </div>

          {/* --- Right Content Area --- */}
          <div className="w-full md:w-3/4">
            {/* Item Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {title}
            </h1>
            {/* Author and Year */}
            <div className="flex items-center gap-2 text-lg text-gray-400 mb-3">
              <span>{year}</span>
              <span>•</span>
              {/* Make author clickable later if author pages are implemented */}
              <span className="hover:text-white cursor-pointer">{author}</span>
            </div>

            {/* Item Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {description}
            </p>

            {/* Average Rating Display */}
            {averageRating !== 'NON' && ( // Only show if rating exists
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700/50">
                <StarRatingDisplay
                  rating={averageRating}
                  size="text-xl"
                  showTextRating={true} // Show numerical rating alongside stars
                />
                <span className="text-xs text-gray-500">
                  ({ratingsCount?.toLocaleString('pt-BR') || '0'} avaliações)
                </span>
              </div>
            )}

            {/* Genres */}
            {genres.length > 0 && ( // Only show if genres exist
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Other Details (Pages, Publisher) */}
            <div className="text-sm text-gray-400 space-y-1 mb-6">
              {pages && ( // Show pages if available
                <p>
                  <strong>Páginas:</strong> {pages}
                </p>
              )}
              {publisher && ( // Show publisher if available
                <p>
                  <strong>Editora:</strong> {publisher}
                </p>
              )}
            </div>

            {/* Where to Read/Buy Section */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-300 mb-2">
                Onde Ler / Comprar
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Online Store Link */}
                {availability.onlineStoreUrl && (
                  <a
                    href={availability.onlineStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold py-1 px-3 rounded-md transition-colors border border-gray-600"
                  >
                    Loja Online
                  </a>
                )}
                {/* Library Link (already handled above, maybe redundant here?) */}
                {/* If no links, show message */}
                {!availability.onlineStoreUrl && !availability.libraryUrl && !availability.downloadUrl && (
                  <span className="text-xs text-gray-500 italic">
                    Informação de compra/leitura não disponível.
                  </span>
                )}
              </div>
            </div>

            {/* Similar Items Section */}
            {similarBooks.length > 0 && (
              <SimilarItemsSection
                title="Livros Semelhantes"
                itemIds={similarBooks}
                currentItemId={itemId}
                favorites={favorites}
                onFavoriteToggle={onFavoriteToggle}
              />
            )}

            {/* Reviews Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Reviews ({itemReviews.length})
              </h3>

              {/* Display Recent Reviews first */}
              {itemReviews.length > 0 ? (
                  // Sort reviews by timestamp descending for recent first
                  itemReviews
                      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)) // Add fallback for missing timestamp
                      .map((review) => (
                          <ReviewCard key={review.id} review={review} />
                      ))
              ) : (
                  // Message if no reviews exist for this item
                  <p className="text-gray-500 italic text-sm text-center py-5">
                      Ainda não há reviews para este item. Seja o primeiro a avaliar!
                  </p>
              )}

              {/* Optionally, you could add a separate section for "Popular Reviews" */}
              {/* {popularItemReviews.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-400 mb-1">
                    Populares
                  </h4>
                  {popularItemReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
       {/* CSS for fade-in animation */}
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};


// --- Main App Component ---
function App() {
  // --- State ---
  const [favorites, setFavorites] = useState([]); // Stores IDs of favorited items
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar visibility
  const [currentUser, setCurrentUser] = useState(allUsersData[0]); // Assumes first user is logged in
  const [following, setFollowing] = useState(currentUser.following || []); // IDs of users the currentUser follows
  const [notifications, setNotifications] = useState([]); // Array of notification objects
  const [userSearchTerm, setUserSearchTerm] = useState(''); // Input for user search
  const [userSearchResults, setUserSearchResults] = useState([]); // Results of user search
  const [showUserSearchDropdown, setShowUserSearchDropdown] = useState(false); // User search dropdown visibility
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false); // Notifications dropdown visibility

  // --- Refs ---
  const userSearchRef = useRef(null); // Ref for user search input/dropdown area
  const notificationsRef = useRef(null); // Ref for notifications dropdown area
  const navigate = useNavigate(); // Hook for programmatic navigation

  // --- Effects ---
  // Load favorites from localStorage on initial mount
  useEffect(() => {
    try {
        const stored = localStorage.getItem('virtualLibraryFavorites');
        if (stored) {
            const parsedFavorites = JSON.parse(stored);
            // Basic validation: ensure it's an array
            if (Array.isArray(parsedFavorites)) {
                 setFavorites(parsedFavorites);
            } else {
                console.warn("Invalid data found in localStorage for favorites. Resetting.");
                localStorage.removeItem('virtualLibraryFavorites');
            }
        }
    } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
        // Optionally clear corrupted data
        localStorage.removeItem('virtualLibraryFavorites');
    }
  }, []); // Empty dependency array: runs only once on mount

  // Save favorites to localStorage whenever the favorites state changes
  useEffect(() => {
    try {
        localStorage.setItem('virtualLibraryFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
        // Handle potential storage errors (e.g., quota exceeded)
    }
  }, [favorites]); // Dependency: runs whenever 'favorites' changes

  // Effect to handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user search dropdown if click is outside its ref
      if (userSearchRef.current && !userSearchRef.current.contains(event.target)) {
        setShowUserSearchDropdown(false);
      }
      // Close notifications dropdown if click is outside its ref
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotificationsDropdown(false);
      }
    };
    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);
    // Remove event listener on unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array: runs once

  // Effect to perform user search when search term changes
  useEffect(() => {
    if (userSearchTerm.trim() === '') {
      // Clear results and hide dropdown if search term is empty
      setUserSearchResults([]);
      setShowUserSearchDropdown(false);
      return;
    }
    // Filter users based on username (case-insensitive), excluding the current user
    const results = allUsersData.filter(
      (user) =>
        user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
        user.id !== currentUser.id // Don't show self in search results
    );
    setUserSearchResults(results);
    setShowUserSearchDropdown(results.length > 0); // Show dropdown only if there are results
  }, [userSearchTerm, currentUser.id]); // Dependencies: search term and current user ID

  // --- Event Handlers ---
  // Toggle favorite status for an item
  const handleFavoriteToggle = (itemId) =>
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId) // Remove if already favorite
        : [...prev, itemId] // Add if not favorite
    );

  // Toggle follow status for a user
  const handleFollowToggle = (userIdToToggle) => {
    // Prevent following/unfollowing self
    if (userIdToToggle === currentUser.id) return;

    setFollowing((prevFollowing) => {
      const isCurrentlyFollowing = prevFollowing.includes(userIdToToggle);
      const newFollowing = isCurrentlyFollowing
        ? prevFollowing.filter((id) => id !== userIdToToggle) // Unfollow
        : [...prevFollowing, userIdToToggle]; // Follow

      // --- Important Note on Data Persistence ---
      // This updates the local 'following' state and mutates the 'currentUser' object directly.
      // In a real app, you should:
      // 1. Update the state using the setter (`setFollowing`).
      // 2. Send an API request to your backend to record the follow/unfollow action.
      // 3. Update the `currentUser` data based on the successful API response,
      //    likely through a state management solution or by refetching user data.
      currentUser.following = newFollowing; // Direct mutation - avoid if possible
      console.log("Updated Following List (in memory):", newFollowing);
      // --- End Data Persistence Note ---

      return newFollowing; // Return the new state for setFollowing
    });
  };


  // Add a notification (used when a user posts a review)
  // useCallback ensures the function identity is stable unless dependencies change
  const addNotification = useCallback(
    (notificationData) => {
      // Find users who follow the user who performed the action (e.g., wrote the review)
      const followers = allUsersData.filter((user) =>
        user.following?.includes(notificationData.userId)
      );

      // Check if the currently logged-in user is one of the followers
      const currentUserIsFollower = followers.some(
        (f) => f.id === currentUser.id
      );

      // If the current user is a follower, create and add the notification
      if (currentUserIsFollower) {
        const notificationForCurrentUser = {
          id: `notif-${Date.now()}-${Math.random()}`, // Simple unique ID
          ...notificationData, // Spread the original data (type, userId, itemId)
          recipientId: currentUser.id, // Mark the recipient
          timestamp: new Date(), // Add a timestamp
          read: false, // Mark as unread initially
        };
        // Add the new notification to the beginning of the notifications array
        setNotifications((prev) => [notificationForCurrentUser, ...prev]);
        console.log("Notification added:", notificationForCurrentUser);
      }
    },
    [currentUser.id] // Dependency: function depends on currentUser.id
  );

  // Mark a specific notification as read
  const handleMarkNotificationRead = (notificationId) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)) // Update 'read' status
    );

  // --- Sub-Components ---
  // Navigation Links Component (reusable for header and sidebar)
  const NavLinks = ({ isMobile = false, closeSidebar = () => {} }) => {
    // Function to determine the CSS classes for NavLink based on active state
    const getNavLinkClass = ({ isActive }) => {
      const baseClass = `relative flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
        isMobile ? 'w-full text-left text-base' : 'text-sm' // Different styles for mobile/desktop
      }`;
      return isActive
        ? `${baseClass} text-green-400 font-semibold bg-gray-700/50` // Active link style
        : `${baseClass} text-gray-400 hover:text-white hover:bg-gray-700/30`; // Inactive link style
    };

    return (
      <nav
        className={`flex ${
          isMobile
            ? 'flex-col space-y-2 p-2' // Mobile layout: vertical stack
            : 'items-center space-x-1 lg:space-x-2' // Desktop layout: horizontal row
        }`}
      >
        {/* Home Link */}
        <NavLink to="/" className={getNavLinkClass} onClick={closeSidebar}>
          <HomeIcon className="w-5 h-5 flex-shrink-0" />
          <span className={isMobile ? '' : 'hidden lg:inline'}>Início</span>
        </NavLink>
        {/* Favorites Link */}
        <NavLink
          to="/favorites"
          className={getNavLinkClass}
          onClick={closeSidebar}
        >
          <HeartIcon className="w-5 h-5 flex-shrink-0" />
          <span className={isMobile ? '' : 'hidden lg:inline'}>Favoritos</span>
          {/* Badge for favorite count */}
          {favorites.length > 0 && (
            <span
              className={`absolute top-0 right-0 flex items-center justify-center bg-red-600 text-white text-xxs font-bold w-4 h-4 rounded-full transform translate-x-1/3 -translate-y-1/3`}
            >
              {favorites.length}
            </span>
          )}
        </NavLink>
        {/* Profile Link */}
        <NavLink
          to={`/profile/${currentUser.id}`} // Link to current user's profile
          className={getNavLinkClass}
          onClick={closeSidebar}
        >
          <UserIcon className="w-5 h-5 flex-shrink-0" />
          <span className={isMobile ? '' : 'hidden lg:inline'}>Perfil</span>
        </NavLink>
      </nav>
    );
  };


  // Calculate the count of unread notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  // Function to close the mobile sidebar
  const closeMobileSidebar = () => setIsSidebarOpen(false);

  // --- Main App JSX ---
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
      {/* --- Header --- */}
      <header className="bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center gap-4">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-xl font-bold text-white cursor-pointer hover:text-green-400 transition-colors flex-shrink-0"
          >
            Biblio Virtual
          </Link>

          {/* Desktop Navigation and User Search */}
          <div className="hidden md:flex flex-grow items-center justify-center gap-4 lg:gap-6 max-w-xl">
            {/* User Search Input */}
            <div className="relative flex-grow max-w-xs" ref={userSearchRef}>
              <input
                type="search"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                onFocus={() => userSearchResults.length > 0 && setShowUserSearchDropdown(true)} // Show dropdown on focus if results exist
                placeholder="Buscar usuários..."
                className="w-full p-2 pl-8 text-sm bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-1 focus:ring-green-500 focus:outline-none placeholder-gray-400"
              />
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              {/* User Search Results Dropdown */}
              {showUserSearchDropdown && userSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {userSearchResults.map((user) => (
                      <UserSearchResultCard
                        key={user.id}
                        user={user}
                        isFollowing={following.includes(user.id)} // Pass follow status
                        onFollowToggle={handleFollowToggle} // Pass toggle function
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Desktop Navigation Links */}
            <NavLinks />
          </div>

          {/* Right-side Icons (Notifications, Mobile Menu) */}
          <div className="flex items-center gap-2">
            {/* Notifications Button and Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="text-gray-400 hover:text-white p-2 rounded-full focus:outline-none relative hover:bg-gray-700"
                title="Notificações"
                aria-label={`Notificações (${unreadNotificationsCount} não lidas)`}
              >
                <BellIcon className="w-6 h-6" />
                {/* Unread Count Badge */}
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xxs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              {/* Notifications Dropdown Panel */}
              {showNotificationsDropdown && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-2 text-sm font-semibold border-b border-gray-700 text-gray-200">
                    Notificações
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notification={notif}
                        onDismiss={handleMarkNotificationRead} // Pass dismiss function
                      />
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500 p-4">
                      Nenhuma notificação nova.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger/Close Icon) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Sidebar --- */}
      {/* Overlay */}
      {isSidebarOpen && (
          <div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={closeMobileSidebar}
              aria-hidden="true"
          ></div>
      )}
      {/* Sidebar Content */}
      <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sidebar-title"
      >
          <div className="flex flex-col h-full p-4">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center mb-6">
                  <h2 id="sidebar-title" className="text-lg font-semibold text-white">Menu</h2>
                  <button onClick={closeMobileSidebar} className="text-gray-400 hover:text-white">
                      <XIcon className="w-6 h-6" />
                  </button>
              </div>
              {/* Mobile User Search */}
              <div className="relative mb-4">
                  {/* Note: User search in sidebar might need separate state/logic or reuse header's */}
                  <input
                      type="search"
                      placeholder="Buscar usuários..."
                      className="w-full p-2 pl-8 text-sm bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-1 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                      // Add value and onChange if implementing separate search state
                  />
                  <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              {/* Mobile Navigation Links */}
              <NavLinks isMobile={true} closeSidebar={closeMobileSidebar} />
              {/* Sidebar Footer */}
              <div className="mt-auto text-center text-xs text-gray-500">
                  <p>&copy; {new Date().getFullYear()} Biblio Virtual</p>
                  {/* <p className="mt-2">Lembre-se: use styled-components!</p> */}
              </div>
          </div>
      </div>


      {/* --- Main Content Area --- */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* React Router Routes Definition */}
        <Routes>
          {/* Home Page Route */}
          <Route
            path="/"
            element={
              <HomePage
                items={allItemsData}
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
              />
            }
          />
          {/* Favorites Page Route */}
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                items={allItemsData}
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
              />
            }
          />
          {/* Profile Page Route (handles both own and other users) */}
          <Route
            path="/profile/:userId?" // userId is optional for own profile
            element={
              <ProfilePage
                currentUser={currentUser}
                favorites={favorites}
                following={following}
                onFollowToggle={handleFollowToggle}
              />
            }
          />
          {/* Item Details Page Route */}
          <Route
            path="/item/:itemId"
            element={
              <DetailsPage
                items={allItemsData}
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
                currentUser={currentUser}
                addNotification={addNotification} // Pass notification function
              />
            }
          />
          {/* Catch-all 404 Not Found Route */}
          <Route
            path="*"
            element={
              <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-white mb-4">
                  404 - Página Não Encontrada
                </h1>
                <Link to="/" className="text-green-400 hover:underline">
                  Voltar para Início
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}


// --- App Wrapper with BrowserRouter ---
// This component wraps the main App component with the necessary Router context provider.
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Export the wrapped App as the default export
export default AppWrapper;
