/**
 * Fallback storage when backend is unavailable.
 * Used only by service layer.
 */

import { MOCK_DONATIONS, MOCK_REQUESTS } from './mockData';

const DONATIONS_KEY = 'careconnect_donations';
const REQUESTS_KEY = 'careconnect_requests';

export function isNetworkError(err) {
  if (!err) return false;
  if (err.code === 'ERR_NETWORK') return true;
  if (err.message && typeof err.message === 'string' && err.message.toLowerCase().includes('network')) return true;
  if (err.response == null && err.request != null) return true;
  return false;
}

export function isBackendUnavailable(err) {
  if (!err) return false;
  if (isNetworkError(err)) return true;
  const status = err.response?.status;
  if (status == null || status >= 500 || status === 404) return true;
  return false;
}

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // ignore quota or other errors
  }
}

export function getDonationsFromStorage() {
  const list = safeParse(DONATIONS_KEY, null);
  if (Array.isArray(list)) return list;
  const seed = MOCK_DONATIONS.map((d) => ({ ...d, status: d.status || 'Pending' }));
  safeSet(DONATIONS_KEY, seed);
  return seed;
}

export function saveDonationsToStorage(list) {
  if (Array.isArray(list)) safeSet(DONATIONS_KEY, list);
}

export function getRequestsFromStorage() {
  const list = safeParse(REQUESTS_KEY, null);
  if (Array.isArray(list)) return list;
  const seed = [...MOCK_REQUESTS];
  safeSet(REQUESTS_KEY, seed);
  return seed;
}

export function saveRequestsToStorage(list) {
  if (Array.isArray(list)) safeSet(REQUESTS_KEY, list);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
