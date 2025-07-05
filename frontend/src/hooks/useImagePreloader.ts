import { useState, useEffect, useRef } from 'react';

interface UseImagePreloaderOptions {
  images: string[];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface UseImagePreloaderReturn {
  isLoading: boolean;
  imagesLoaded: boolean;
  loadedImages: Set<string>;
  progress: number;
  getImageSrc: (originalSrc: string) => string;
}

export const useImagePreloader = ({
  images,
  onLoad,
  onError
}: UseImagePreloaderOptions): UseImagePreloaderReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  // Keep preloaded images in memory to prevent re-fetching
  const preloadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const imageElementsRef = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    if (images.length === 0) {
      setIsLoading(false);
      setImagesLoaded(true);
      return;
    }

    setIsLoading(true);
    setImagesLoaded(false);
    setLoadedImages(new Set());

    const preloadImages = images.map(src => {
      return new Promise<string>((resolve, reject) => {
        // Check if we already have this image preloaded
        if (preloadedImagesRef.current.has(src)) {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
          return;
        }

        const img = new Image();
        
        // Set crossOrigin to enable better caching
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Store the loaded image in memory
          preloadedImagesRef.current.set(src, img);
          imageElementsRef.current.set(src, img);
          
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        
        img.onerror = () => {
          const error = new Error(`Failed to load image: ${src}`);
          reject(error);
        };
        
        // Force cache-friendly loading
        img.src = src;
      });
    });

    Promise.allSettled(preloadImages)
      .then((results) => {
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected');
        
        if (failed.length > 0) {
          const errors = failed.map(result => 
            result.status === 'rejected' ? result.reason : new Error('Unknown error')
          );
          console.warn('Some images failed to preload:', errors);
          onError?.(new Error(`${failed.length} images failed to load`));
        }
        
        // Increased delay for mobile stability
        setTimeout(() => {
          setImagesLoaded(successful > 0 || images.length === 0);
          setIsLoading(false);
          onLoad?.();
        }, 150); // Increased from 100ms to 150ms for better mobile performance
      })
      .catch(error => {
        console.error('Critical error during image preloading:', error);
        setImagesLoaded(true); // Fail gracefully
        setIsLoading(false);
        onError?.(error);
      });
  }, [images]); // Removed onLoad and onError from dependencies to prevent infinite loop

  // Function to get the cached image source or fallback to original
  const getImageSrc = (originalSrc: string): string => {
    const preloadedImage = preloadedImagesRef.current.get(originalSrc);
    if (preloadedImage && preloadedImage.complete) {
      // Return the same src but ensure it's from cache
      return originalSrc;
    }
    return originalSrc;
  };

  const progress = images.length > 0 ? (loadedImages.size / images.length) * 100 : 100;

  return {
    isLoading,
    imagesLoaded,
    loadedImages,
    progress,
    getImageSrc
  };
};