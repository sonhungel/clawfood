import type { Location } from '../types';

/**
 * Format tọa độ thành chuỗi dễ đọc
 */
export const formatCoordinates = (location: Location): string => {
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
};

/**
 * Format khoảng cách
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Format địa chỉ ngắn gọn
 */
export const formatAddress = (address: string, maxLength: number = 30): string => {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};
