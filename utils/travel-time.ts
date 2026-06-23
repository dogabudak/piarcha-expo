/**
 * Haversine-based travel time estimation.
 * Calculates straight-line distance between two coordinates,
 * applies a road-factor multiplier, then estimates walk/bike time.
 */

const EARTH_RADIUS_KM = 6371;

// Roads are never straight — multiply straight-line distance by this factor
const ROAD_FACTOR = 1.3;

// Average speeds in km/h
const WALKING_SPEED_KMH = 5;
const BIKING_SPEED_KMH = 15;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Haversine formula: calculates the great-circle distance between two points
 * on the Earth's surface given their latitude and longitude in degrees.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export interface TravelEstimate {
  distanceKm: number;
  walkingMinutes: number;
  bikingMinutes: number;
}

/**
 * Estimates travel time between two coordinate pairs.
 * Returns distance (with road factor applied) and minutes for walking/biking.
 */
export function estimateTravelTime(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): TravelEstimate {
  const straightLine = haversineDistanceKm(lat1, lon1, lat2, lon2);
  const distanceKm = straightLine * ROAD_FACTOR;

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    walkingMinutes: Math.round((distanceKm / WALKING_SPEED_KMH) * 60),
    bikingMinutes: Math.round((distanceKm / BIKING_SPEED_KMH) * 60),
  };
}

interface HasCoordinates {
  x: number; // latitude
  y: number; // longitude
}

/**
 * Sorts an array of stops by distance from a given point (nearest first).
 * Returns a new sorted array — does not mutate the original.
 */
export function sortByNearest<T extends HasCoordinates>(
  stops: T[],
  userLat: number,
  userLon: number,
): T[] {
  return [...stops].sort((a, b) => {
    const distA = haversineDistanceKm(userLat, userLon, a.x, a.y);
    const distB = haversineDistanceKm(userLat, userLon, b.x, b.y);
    return distA - distB;
  });
}

/**
 * Returns the nearest stop from an array of stops.
 */
export function findNearest<T extends HasCoordinates>(
  stops: T[],
  userLat: number,
  userLon: number,
): T | null {
  if (stops.length === 0) return null;
  return sortByNearest(stops, userLat, userLon)[0];
}
