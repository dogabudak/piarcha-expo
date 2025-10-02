import { MOCK_DATA, Tour, Attraction } from '@/data/mockData';

// API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.piarcha.com';
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK === 'true' || !process.env.EXPO_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
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

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new ApiError(result.error || 'API request failed');
      }

      return result.data;
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
          case '/countries':
            resolve(MOCK_DATA.countries as T);
            break;
          case '/tours':
            resolve(MOCK_DATA.tours as T);
            break;
          case '/attractions':
            resolve(MOCK_DATA.attractions as T);
            break;
          default:
            if (basePath.startsWith('/cities/')) {
              const country = basePath.split('/')[2];
              const cities = MOCK_DATA.cities[country] || [];
              resolve(cities as T);
              break;
            }
            if (basePath.startsWith('/coordinates/')) {
              // Mock coordinates response
              resolve({ lat: 41.0082, lng: 28.9784 } as T);
              break;
            }
            resolve([] as T);
        }
      }, delay);
    }) as T;
  }

  static async getCountries(): Promise<string[]> {
    return this.request<string[]>('/countries');
  }

  static async getCities(country: string): Promise<string[]> {
    return this.request<string[]>(`/cities/${encodeURIComponent(country)}`);
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
    return this.request<{ lat: number; lng: number }>(`/coordinates/${encodeURIComponent(city)}`);
  }
}