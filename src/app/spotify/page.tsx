'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
// import { motion } from 'framer-motion'; // Check if framer-motion is used. It was imported but not ostensibly used in the JSX shown. The user code had an import but seemingly no usage in the visible 143 lines except maybe implicitly?
// Looking at the view_file output for spotify.jsx:
// Line 5: import { motion } from 'framer-motion';
// But I don't see <motion.div> or similar. 
// Ah, checking lines 95-135... no motion components.
// It seems framer-motion might be unused or used in parts I missed?
// I'll keep the import if I use it, or remove it if unused. It seems unused in the snippet provided.
// Wait, line 44: animate-pulse is Tailwind.
// I'll leave framer-motion out if it's not used, or re-add if I see it's needed.
// Actually, I'll keep it simple.

interface SpotifyItem {
  coverImage?: string;
  title?: string;
  artist?: string;
  url?: string;
}

const SpotifyPage = () => {
  const [category, setCategory] = useState<'artists' | 'tracks'>('artists');
  const [items, setItems] = useState<SpotifyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // Use useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/top${capitalize(category)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch top ${category}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
      setError(`Could not load top ${category}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  // Add fetchData to the dependency array
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Card loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden dark:bg-zinc-800/50 animate-pulse">
          <div className="w-full aspect-square bg-gray-200 dark:bg-zinc-700"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 dark:bg-zinc-700"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 dark:bg-zinc-700"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-zinc-700"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="spotify-page flex flex-col items-center p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-gray-800 dark:text-zinc-100">
        My Top Spotify {capitalize(category)}
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8 dark:text-zinc-400 max-w-2xl">
        A personalized showcase of my favorite {category}, powered by the Spotify API. 
        Discover the music that inspires me!
      </p>
      
      <div className="flex justify-center mb-10">
        {['artists', 'tracks'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat as 'artists' | 'tracks')}
            className={`px-6 py-2 mx-2 rounded-full font-medium transition-all duration-300 ${
              category === cat 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {capitalize(cat)}
          </button>
        ))}
      </div>
      
      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded dark:bg-red-900/30 dark:text-red-300">
          <p>{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className="item-card flex flex-col bg-white shadow-lg rounded-lg overflow-hidden dark:bg-zinc-800 hover:shadow-xl transition-shadow duration-300"
              style={{ minHeight: '300px' }} // Force minimum height
            >
              {/* Image container with fixed aspect ratio */}
              <div className="relative w-full pt-[100%] bg-gray-200 dark:bg-zinc-700"> {/* Add background color */}
                {item.coverImage && (
                  <Image
                    src={item.coverImage}
                    alt={item.title || 'Spotify item'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover absolute top-0 left-0"
                    priority={index < 4}
                    onError={(e) => {
                      // Fallback for image loading errors
                      // e.target.style.display = 'none'; // Typescript doesn't like this directly without cast
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div className="p-4 flex-1"> {/* Add flex-1 to make it expand */}
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                  #{index + 1}
                </p>
                <h2 className="text-lg font-semibold text-gray-800 truncate dark:text-zinc-100">
                  {item.title || 'Unknown Item'}
                </h2>
                {item.artist && (
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                    {item.artist}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpotifyPage;
