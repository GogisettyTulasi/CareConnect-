import api from './api';
import { getMockAuth, delay } from '../utils/mockData';
import { isBackendUnavailable, getStoredUser } from '../utils/storageFallback';

const AUTH_BASE = '/api/auth';
const USE_MOCK = import.meta.env.VITE_MOCK_API === 'true';

function nextId() {
  return String(Date.now());
}

/**
 * Login - POST /api/auth/login
 * On network/backend failure: fallback to localStorage-based auth (demo users or create from email).
 */
export const login = async (email, password) => {
  if (USE_MOCK) {
    await delay(400);
    const result = getMockAuth(email, password);
    if (!result) throw new Error('Invalid email or password');
    return result;
  }
  try {
    const { data } = await api.post(`${AUTH_BASE}/login`, { email, password });
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(400);
      const result = getMockAuth(email, password);
      if (result) return result;
      const user = {
        id: nextId(),
        email: email.trim(),
        name: email.trim().split('@')[0],
        role: 'USER',
      };
      return { token: 'local-' + user.id, user };
    }
    const msg = err.response?.data?.message || (err.message && !err.message.toLowerCase().includes('network') ? err.message : null);
    throw new Error(msg || 'Invalid email or password');
  }
};

/**
 * Signup - POST /api/auth/signup
 * On network/backend failure: create user and token, return (AuthContext will persist to localStorage).
 */
export const signup = async (payload) => {
  if (USE_MOCK) {
    await delay(400);
    const user = {
      id: nextId(),
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      role: payload.role || 'USER',
    };
    return { token: 'local-' + user.id, user };
  }
  try {
    const { data } = await api.post(`${AUTH_BASE}/signup`, payload);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(400);
      const user = {
        id: nextId(),
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        role: payload.role || 'USER',
      };
      return { token: 'local-' + user.id, user };
    }
    const msg = err.response?.data?.message || (err.message && !err.message.toLowerCase().includes('network') ? err.message : null);
    throw new Error(msg || 'Signup failed');
  }
};

/**
 * Get current user - GET /api/auth/me
 * On failure: return stored user from localStorage (auto-login when token exists).
 */
export const getCurrentUser = async () => {
  if (USE_MOCK) {
    await delay(100);
    return getStoredUser();
  }
  try {
    const { data } = await api.get(`${AUTH_BASE}/me`);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) return getStoredUser();
    throw err;
  }
};
