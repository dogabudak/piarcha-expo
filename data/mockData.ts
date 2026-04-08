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

export interface TourStop {
  order: number;
  name: string;
  description: string;
  x: number;
  y: number;
  estimatedMinutes: number;
}

export interface GeneratedTour {
  tourName: string;
  shortDescription: string;
  tourType: string;
  estimatedDuration: string;
  distanceKm: number;
  generatedBy: string;
  stops: TourStop[];
}

export const MOCK_GENERATED_TOUR: GeneratedTour = {
  tourName: 'Historical Walking Tour of Istanbul',
  shortDescription: "A curated walking tour through Istanbul's most iconic historical sites",
  tourType: 'Hike',
  estimatedDuration: '3 hours',
  distanceKm: 4.2,
  generatedBy: 'ai',
  stops: [
    {
      order: 1,
      name: 'Hagia Sophia',
      description: 'A masterpiece of Byzantine architecture, originally built as a cathedral in 537 AD.',
      x: 41.008545,
      y: 28.9770532,
      estimatedMinutes: 30,
    },
    {
      order: 2,
      name: 'Blue Mosque',
      description: 'Known for its stunning blue Iznik tiles and six minarets.',
      x: 41.0054,
      y: 28.9768,
      estimatedMinutes: 25,
    },
    {
      order: 3,
      name: 'Basilica Cistern',
      description: 'An ancient underground water reservoir built in the 6th century.',
      x: 41.0084,
      y: 28.9779,
      estimatedMinutes: 20,
    },
    {
      order: 4,
      name: 'Topkapi Palace',
      description: 'The opulent main residence of the Ottoman sultans for nearly 400 years.',
      x: 41.0115,
      y: 28.9834,
      estimatedMinutes: 45,
    },
    {
      order: 5,
      name: 'Grand Bazaar',
      description: 'One of the oldest and largest covered markets in the world.',
      x: 41.0107,
      y: 28.968,
      estimatedMinutes: 30,
    },
  ],
};

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