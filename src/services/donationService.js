import api from './api';
import { delay } from '../utils/mockData';
import {
  isBackendUnavailable,
  getDonationsFromStorage,
  saveDonationsToStorage,
  getStoredUser,
} from '../utils/storageFallback';

const DONATIONS_BASE = '/api/donations';
const USE_MOCK = import.meta.env.VITE_MOCK_API === 'true';

function nextId() {
  return String(Date.now());
}

function normalizeDonation(d) {
  const requests = Array.isArray(d.requests) ? [...d.requests] : [];
  if (d.reservedBy && requests.length === 0) {
    requests.push({ userId: d.reservedBy, quantityRequested: 1 });
  }
  const { reservedBy, ...rest } = d;
  return { ...rest, requests };
}

/**
 * GET /api/donations - list all donations.
 * On failure: load from localStorage (persisted across refresh).
 */
export const getDonations = async (params = {}) => {
  if (USE_MOCK) {
    await delay(300);
    const list = getDonationsFromStorage().map(normalizeDonation);
    return list.filter((d) => !params.status || d.status === params.status);
  }
  try {
    const { data } = await api.get(DONATIONS_BASE, { params });
    return Array.isArray(data) ? data.map(normalizeDonation) : data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      const list = getDonationsFromStorage().map(normalizeDonation);
      return list.filter((d) => !params.status || d.status === params.status);
    }
    throw err;
  }
};

/**
 * POST /api/donations - create a donation.
 * On failure: save to localStorage and return new donation.
 */
export const createDonation = async (payload) => {
  if (USE_MOCK) {
    await delay(300);
    const user = getStoredUser();
    const donorId = user?.id || '1';
    const newDonation = {
      id: nextId(),
      ...payload,
      donorId,
      requests: [],
      createdAt: new Date().toISOString(),
    };
    const list = getDonationsFromStorage();
    list.unshift(newDonation);
    saveDonationsToStorage(list);
    return newDonation;
  }
  try {
    const { data } = await api.post(DONATIONS_BASE, payload);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(300);
      const user = getStoredUser();
      const donorId = user?.id || '1';
      const newDonation = {
        id: nextId(),
        ...payload,
        donorId,
        requests: [],
        createdAt: new Date().toISOString(),
      };
      const list = getDonationsFromStorage();
      list.unshift(newDonation);
      saveDonationsToStorage(list);
      return newDonation;
    }
    throw err;
  }
};

/**
 * GET /api/donations/:id
 */
export const getDonationById = async (id) => {
  if (USE_MOCK) {
    await delay(200);
    const list = getDonationsFromStorage();
    const d = list.find((x) => x.id === id);
    if (!d) throw new Error('Donation not found');
    return d;
  }
  try {
    const { data } = await api.get(`${DONATIONS_BASE}/${id}`);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      const list = getDonationsFromStorage();
      const d = list.find((x) => x.id === id);
      if (!d) throw new Error('Donation not found');
      return d;
    }
    throw err;
  }
};

/**
 * PATCH /api/donations/:id
 */
export const updateDonation = async (id, payload) => {
  if (USE_MOCK) {
    await delay(200);
    const list = getDonationsFromStorage();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Donation not found');
    list[idx] = { ...list[idx], ...payload };
    saveDonationsToStorage(list);
    return list[idx];
  }
  try {
    const { data } = await api.patch(`${DONATIONS_BASE}/${id}`, payload);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      const list = getDonationsFromStorage();
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error('Donation not found');
      list[idx] = { ...list[idx], ...payload };
      saveDonationsToStorage(list);
      return list[idx];
    }
    throw err;
  }
};

/**
 * GET /api/donations/my - current user's donations
 */
export const getMyDonations = async () => {
  if (USE_MOCK) {
    await delay(200);
    const user = getStoredUser();
    const list = getDonationsFromStorage().map(normalizeDonation);
    return list.filter((d) => d.donorId === user?.id);
  }
  try {
    const { data } = await api.get(`${DONATIONS_BASE}/my`);
    return Array.isArray(data) ? data.map(normalizeDonation) : data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      const user = getStoredUser();
      const list = getDonationsFromStorage().map(normalizeDonation);
      return list.filter((d) => d.donorId === user?.id);
    }
    throw err;
  }
};
