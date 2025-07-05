import { useState, useCallback } from 'react';

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
  handleImageLoad: (src: string) => void;
  handleImageError: (src: string) => void;
}

export const useImagePreloader = ({
  images,
  onLoad,
  onError
}: UseImagePreloaderOptions): UseImagePreloaderReturn => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      
      // Check if all images are loaded
      if (newSet.size === images.length) {
        setTimeout(() => {
          onLoad?.();
        }, 50); // Small delay to ensure smooth transition
      }
      
      return newSet;
    });
  }, [images.length, onLoad]);

  const handleImageError = useCallback((src: string) => {
    setErrorImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      
      console.error(`Failed to load image: ${src}`);
      onError?.(new Error(`Failed to load image: ${src}`));
      
      return newSet;
    });
  }, [onError]);

  const getImageSrc = useCallback((originalSrc: string): string => {
    return originalSrc;
  }, []);

  const totalImages = images.length;
  const totalLoaded = loadedImages.size + errorImages.size;
  const isLoading = totalLoaded < totalImages;
  const imagesLoaded = !isLoading && loadedImages.size > 0;
  const progress = totalImages > 0 ? (totalLoaded / totalImages) * 100 : 100;

  return {
    isLoading,
    imagesLoaded,
    loadedImages,
    progress,
    getImageSrc,
    handleImageLoad,
    handleImageError
  };
};