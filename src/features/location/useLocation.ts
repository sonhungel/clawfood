import { useState, useEffect, useCallback } from 'react';
import type { LocationState } from './location.types';

/**
 * Custom hook lấy vị trí hiện tại của người dùng
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null,
    address: null,
  });

  const getAddress = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await response.json();
      if (data.address) {
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.suburb) parts.push(data.address.suburb);
        if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
        return parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || 'Unknown location';
      }
      return 'Unknown location';
    } catch {
      return 'Unknown location';
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Your browser does not support Geolocation',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddress(latitude, longitude);
        setState({
          location: { latitude, longitude, address },
          loading: false,
          error: null,
          address,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [getAddress]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    ...state,
    refresh: getCurrentLocation,
  };
}
