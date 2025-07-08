import { authApiRequest } from './api';

// Fetch the current user's profile
export async function getProfile(getToken: () => Promise<string | null>) {
  const response = await authApiRequest('get', '/auth/profile', getToken);
  return response.data;
}

// Fetch the current user's orders
export async function getProfileOrders(getToken: () => Promise<string | null>) {
  const response = await authApiRequest('get', '/auth/profile/orders', getToken);
  return response.data;
} 