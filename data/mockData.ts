export interface Tour {
  id: number;
  name: string;
  duration: string;
  price: string;
}

export interface Attraction {
  id: number;
  name: string;
  type: string;
  rating: number;
}

export interface MockData {
  countries: string[];
  featuredCountries: string[];
  cities: Record<string, string[]>;
  tours: Tour[];
  attractions: Attraction[];
}

export const MOCK_DATA: MockData = {
  countries: ['Turkey', 'Italy', 'Spain', 'Greece', 'France'],
  featuredCountries: ['Turkey', 'Italy'],
  cities: {
    'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Florence'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
    'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Rhodes'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Nice'],
  },
  tours: [
    { id: 1, name: 'Historical City Walk', duration: '3 hours', price: '$25' },
    { id: 2, name: 'Food & Culture Tour', duration: '4 hours', price: '$45' },
    { id: 3, name: 'Sunset Photography Tour', duration: '2 hours', price: '$30' },
  ],
  attractions: [
    { id: 1, name: 'Historic Center', type: 'Historical', rating: 4.8 },
    { id: 2, name: 'Local Market', type: 'Cultural', rating: 4.5 },
    { id: 3, name: 'Scenic Viewpoint', type: 'Nature', rating: 4.7 },
  ],
};