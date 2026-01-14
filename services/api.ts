import { MOCK_DATA, Tour, Attraction } from '@/data/mockData';

// API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3019';
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CountryListResponse {
  countries: string[];
  featured: string[];
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for:', endpoint);
      return this.getMockData<T>(endpoint);
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('API request failed, falling back to mock data:', error);
      return this.getMockData<T>(endpoint);
    }
  }

  private static getMockData<T>(endpoint: string): T {
    // Simulate API delay
    const delay = Math.random() * 1000 + 500; // 500-1500ms delay
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Extract the base path without query parameters
        const basePath = endpoint.split('?')[0];
        
        switch (basePath) {
          case '/countryList':
            resolve({
              countries: MOCK_DATA.countries,
              featured: MOCK_DATA.featuredCountries
            } as T);
            break;
          case '/tours':
            resolve(MOCK_DATA.tours as T);
            break;
          case '/attractions':
            resolve(MOCK_DATA.attractions as T);
            break;
          default:
            if (basePath.startsWith('/cityList/')) {
              const country = basePath.split('/')[2];
              const cities = MOCK_DATA.cities[country] || [];
              resolve(cities as T);
              break;
            }
            if (basePath.startsWith('/coordinates/')) {
              // Mock coordinates response
              resolve({ coordinates: [{ city: 'Istanbul', name: 'Example Location', x: 41.0082, y: 28.9784 }] } as T);
              break;
            }
            resolve([] as T);
        }
      }, delay);
    }) as T;
  }

  static async getCountries(): Promise<CountryListResponse> {
    return this.request<CountryListResponse>('/countryList');
  }

  static async getCities(country: string): Promise<string[]> {
    return this.request<string[]>(`/cityList/${encodeURIComponent(country)}`);
  }

  static async getTours(country?: string, city?: string): Promise<Tour[]> {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (city) params.append('city', city);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Tour[]>(`/tours${query}`);
  }

  static async getAttractions(country?: string, city?: string): Promise<Attraction[]> {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (city) params.append('city', city);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Attraction[]>(`/attractions${query}`);
  }

  static async getCoordinates(city: string): Promise<{ lat: number; lng: number }> {
    const response = await this.request<{ coordinates: Array<{ city: string; name: string; x: number; y: number }> }>(`/coordinates/${encodeURIComponent(city)}`);
    // Convert backend format to expected format
    if (response.coordinates && response.coordinates.length > 0) {
      const coord = response.coordinates[0];
      return { lat: coord.x, lng: coord.y };
    }
    return { lat: 41.0082, lng: 28.9784 }; // Default coordinates
  }
}