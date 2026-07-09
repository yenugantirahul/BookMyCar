import type { CarFilters, Car } from '@/types';

const DUMMY_CARS: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    color: 'White',
    licensePlate: 'TSLA-Y23',
    pricePerDay: '89.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'electric',
    location: 'Mumbai International Airport',
    description: 'All-electric SUV with long range, autopilot capabilities, and premium interior comfort. Excellent condition.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img1', url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Camry Hybrid',
    year: 2022,
    color: 'Silver',
    licensePlate: 'TOY-CAM22',
    pricePerDay: '45.00',
    category: 'standard',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'hybrid',
    location: 'Connaught Place, New Delhi',
    description: 'Very reliable and fuel-efficient hybrid sedan. Perfect for city driving and long road trips.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img2', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    color: 'Isle of Man Green',
    licensePlate: 'BMW-M4C',
    pricePerDay: '150.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 4,
    fuelType: 'petrol',
    location: 'Kempegowda Airport, Bangalore',
    description: 'High-performance coupe with 503 horsepower. Experience ultimate driving pleasure and modern cabin technology.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img3', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    make: 'Jeep',
    model: 'Wrangler Unlimited',
    year: 2021,
    color: 'Granite Crystal',
    licensePlate: 'JEP-WRG21',
    pricePerDay: '75.00',
    category: 'suv',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'petrol',
    location: 'Rajiv Gandhi Airport, Hyderabad',
    description: 'Rugged 4x4 SUV with removable doors and roof. Ideal for outdoor adventures and scenic road trips.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img4', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    make: 'Audi',
    model: 'Q7',
    year: 2022,
    color: 'Black',
    licensePlate: 'AUDI-Q7X',
    pricePerDay: '110.00',
    category: 'suv',
    transmission: 'automatic',
    seats: 7,
    fuelType: 'petrol',
    location: 'Chennai International Airport',
    description: 'Luxurious and spacious 7-seater SUV. Perfect for family trips with top-tier technology and comfort.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img5', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2023,
    color: 'Obsidian Black',
    licensePlate: 'MBZ-S500',
    pricePerDay: '200.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'hybrid',
    location: 'Banjara Hills, Hyderabad',
    description: 'The pinnacle of luxury sedans. Experience unparalleled ride quality, advanced driver assistance, and an opulent interior.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img6', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2022,
    color: 'Race Red',
    licensePlate: 'FST-GT22',
    pricePerDay: '95.00',
    category: 'premium',
    transmission: 'manual',
    seats: 4,
    fuelType: 'petrol',
    location: 'Marine Drive, Mumbai',
    description: 'Classic American muscle car with a roaring V8 engine and a thrilling manual transmission. Perfect for the open road.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1584345611127-8fb37cb33cb8?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img7', url: 'https://images.unsplash.com/photo-1584345611127-8fb37cb33cb8?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2021,
    color: 'Guards Red',
    licensePlate: 'POR-911',
    pricePerDay: '250.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 2,
    fuelType: 'petrol',
    location: 'Baga Beach, Goa',
    description: 'Iconic sports car offering precision handling, timeless design, and an exhilarating driving experience.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1503376760361-b978a165a639?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img8', url: 'https://images.unsplash.com/photo-1503376760361-b978a165a639?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    make: 'Chevrolet',
    model: 'Tahoe',
    year: 2022,
    color: 'Midnight Blue',
    licensePlate: 'CHV-THOE',
    pricePerDay: '85.00',
    category: 'suv',
    transmission: 'automatic',
    seats: 8,
    fuelType: 'petrol',
    location: 'Pune International Airport',
    description: 'Massive interior space, strong towing capability, and a comfortable ride. Ideal for large groups and heavy luggage.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img9', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    color: 'Lunar Silver',
    licensePlate: 'HON-CVC',
    pricePerDay: '35.00',
    category: 'economy',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'petrol',
    location: 'Koramangala, Bangalore',
    description: 'The standard for reliable, efficient, and comfortable daily driving. Excellent fuel economy and modern safety features.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img10', url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    make: 'Lamborghini',
    model: 'Aventador',
    year: 2023,
    color: 'White',
    licensePlate: 'LMB-AVN',
    pricePerDay: '380.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 2,
    fuelType: 'petrol',
    location: 'Jubilee Hills, Hyderabad',
    description: 'Unmatched performance combined with striking aggressive design.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1502877338595-a28a30eb6a7c?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img11', url: 'https://images.unsplash.com/photo-1502877338595-a28a30eb6a7c?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    make: 'Volkswagen',
    model: 'Golf GTI',
    year: 2021,
    color: 'Tornado Red',
    licensePlate: 'VW-GTI',
    pricePerDay: '65.00',
    category: 'premium',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'petrol',
    location: 'Salt Lake City, Kolkata',
    description: 'The quintessential hot hatch. Practical for everyday use but incredibly fun on winding roads.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img12', url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    make: 'Ferrari',
    model: '488 Spider',
    year: 2022,
    color: 'Rosso Corsa',
    licensePlate: 'FER-488',
    pricePerDay: '450.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 2,
    fuelType: 'petrol',
    location: 'HITEC City, Hyderabad',
    description: 'Exotic convertible delivering breathtaking speed, a thrilling exhaust note, and stunning looks.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img13', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '14',
    make: 'Chevrolet',
    model: 'Camaro',
    year: 2020,
    color: 'Bayside Blue',
    licensePlate: 'GZILLA',
    pricePerDay: '85.00',
    category: 'premium',
    transmission: 'automatic',
    seats: 4,
    fuelType: 'petrol',
    location: 'Bandra Kurla Complex, Mumbai',
    description: 'Aggressive styling and strong performance that makes a statement everywhere you go.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img14', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '15',
    make: 'Lexus',
    model: 'LC 500',
    year: 2023,
    color: 'Red',
    licensePlate: 'HYN-EL',
    pricePerDay: '138.00',
    category: 'luxury',
    transmission: 'automatic',
    seats: 4,
    fuelType: 'petrol',
    location: 'Whitefield, Bangalore',
    description: 'Stunning design and refined power. The pinnacle of grand touring luxury.',
    isAvailable: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000',
    images: [{ id: 'img15', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000', isPrimary: true, displayOrder: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let errorMessage = `Request failed: ${res.status}`;
    let code: string | undefined;
    try {
      const body = await res.json();
      errorMessage = body?.error?.message ?? errorMessage;
      code = body?.error?.code;
    } catch {}
    throw new ApiError(res.status, errorMessage, code);
  }

  return res.json() as Promise<T>;
}

// ── Cars ─────────────────────────────────────────────────────────────────────
export async function getCars(filters: CarFilters = {}, token?: string) {
  // Simulate network delay and return dummy data
  await new Promise((r) => setTimeout(r, 500));
  
  let filtered = [...DUMMY_CARS];
  if (filters.category) filtered = filtered.filter(c => c.category === filters.category);
  if (filters.location) filtered = filtered.filter(c => c.location.toLowerCase().includes(filters.location!.toLowerCase()));
  if (filters.make) filtered = filtered.filter(c => c.make.toLowerCase().includes(filters.make!.toLowerCase()));

  return {
    success: true,
    data: filtered,
    pagination: { total: filtered.length, page: 1, limit: 12 }
  };
}

export async function getCar(id: string, token?: string) {
  await new Promise((r) => setTimeout(r, 300));
  const car = DUMMY_CARS.find(c => c.id === id);
  if (!car) throw new ApiError(404, 'Car not found');
  
  return {
    success: true,
    data: car
  };
}

export async function createCar(data: unknown, token: string) {
  return fetchApi<any>('/api/v1/cars', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

export async function updateCar(id: string, data: unknown, token: string) {
  return fetchApi<any>(`/api/v1/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteCar(id: string, token: string) {
  return fetchApi<any>(`/api/v1/cars/${id}`, { method: 'DELETE', token });
}

export async function uploadCarImage(
  carId: string,
  file: File,
  isPrimary: boolean,
  token: string,
) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('isPrimary', String(isPrimary));
  formData.append('displayOrder', '0');

  const res = await fetch(`${API_URL}/api/v1/cars/${carId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error?.message ?? 'Upload failed');
  }
  return res.json();
}

export async function deleteCarImage(carId: string, imageId: string, token: string) {
  return fetchApi<any>(`/api/v1/cars/${carId}/images/${imageId}`, {
    method: 'DELETE',
    token,
  });
}

const STORAGE_KEY = 'car_rental_dummy_bookings';

function getDummyBookings(): any[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveDummyBookings(bookings: any[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }
}
// ── Bookings ──────────────────────────────────────────────────────────────────
export async function getBookings(filters: { status?: string; page?: number } = {}, token: string) {
  await new Promise((r) => setTimeout(r, 500));
  const bookings = getDummyBookings();
  let filtered = [...bookings];
  if (filters.status) filtered = filtered.filter(b => b.status === filters.status);
  
  return {
    success: true,
    data: filtered,
    pagination: { total: filtered.length, page: 1, limit: 12 }
  };
}

export async function getBooking(id: string, token: string) {
  await new Promise((r) => setTimeout(r, 400));
  const bookings = getDummyBookings();
  const booking = bookings.find(b => b.id === id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  
  return { success: true, data: booking };
}

export async function createBooking(data: {
  carId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}, token: string) {
  await new Promise((r) => setTimeout(r, 800));
  const car = DUMMY_CARS.find(c => c.id === data.carId);
  if (!car) throw new ApiError(404, 'Car not found');

  const start = new Date(`${data.startDate}T00:00:00`);
  const end = new Date(`${data.endDate}T00:00:00`);
  const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = totalDays * parseFloat(car.pricePerDay);

  const newBooking = {
    id: Math.random().toString(36).substring(2, 9),
    carId: car.id,
    userId: 'mock-user-123',
    startDate: data.startDate,
    endDate: data.endDate,
    totalDays,
    pricePerDay: car.pricePerDay,
    totalAmount: totalAmount.toFixed(2),
    status: 'pending',
    notes: data.notes,
    car,
    createdAt: new Date().toISOString(),
  };

  const bookings = getDummyBookings();
  bookings.unshift(newBooking);
  saveDummyBookings(bookings);

  return { success: true, data: newBooking };
}

export async function cancelBooking(id: string, reason: string | undefined, token: string) {
  await new Promise((r) => setTimeout(r, 500));
  const bookings = getDummyBookings();
  const booking = bookings.find(b => b.id === id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  
  booking.status = 'cancelled';
  booking.cancellationReason = reason;
  saveDummyBookings(bookings);

  return { success: true, data: booking };
}

export async function confirmBookingPayment(id: string) {
  await new Promise((r) => setTimeout(r, 800)); // Simulate payment processing delay
  const bookings = getDummyBookings();
  const booking = bookings.find(b => b.id === id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  
  booking.status = 'confirmed'; // Payment successful!
  saveDummyBookings(bookings);

  return { success: true, data: booking };
}

const PROFILE_STORAGE_KEY = 'car_rental_dummy_profile';

function getDummyProfile() {
  if (typeof window === 'undefined') {
    return {
      id: 'mock-user-123',
      email: 'demo@example.com',
      fullName: 'Demo User',
      role: 'admin',
      phone: '+1 555-0199',
    };
  }
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  
  const defaultProfile = {
    id: 'mock-user-123',
    email: 'demo@example.com',
    fullName: 'Demo User',
    role: 'admin',
    phone: '+1 555-0199',
  };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export async function getProfile(token: string) {
  await new Promise((r) => setTimeout(r, 200));
  return {
    success: true,
    data: getDummyProfile()
  };
}

export async function updateProfile(data: any, token: string) {
  await new Promise((r) => setTimeout(r, 400));
  const currentProfile = getDummyProfile();
  const updatedProfile = { ...currentProfile, ...data };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
  }

  return {
    success: true,
    data: updatedProfile
  };
}

export async function uploadAvatar(file: File, token: string) {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${API_URL}/api/v1/users/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error?.message ?? 'Upload failed');
  }
  return res.json();
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function getAdminBookings(
  filters: { status?: string; page?: number } = {},
  token: string,
) {
  // Admin can view all bookings — for now, same endpoint with admin JWT
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v));
  });
  const qs = params.toString();
  return fetchApi<any>(`/api/v1/bookings${qs ? `?${qs}` : ''}`, { token });
}

export { ApiError };
