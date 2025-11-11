export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ==================== USER RESPONSES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyUser {
  id: string;
  name: string;
  email: string;
}

export interface PropertyFavourite {
  id: string;
  userId: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  status: string;
  images: string[];
  userId: string;
  user: PropertyUser;
  favourites: PropertyFavourite[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FavouriteUser {
  id: string;
  name: string;
  email: string;
}

export interface FavouriteProperty {
  id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  status: string;
  images: string[];
  userId: string;
  user: FavouriteUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favourite {
  id: string;
  userId: string;
  user: FavouriteUser;
  propertyId: string;
  property: Property;
  createdAt: Date;
}

export interface ErrorResponse {
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
