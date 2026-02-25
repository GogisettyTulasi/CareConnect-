import api from './api';
import { delay } from '../utils/mockData';
import {
  isBackendUnavailable,
  getRequestsFromStorage,
  saveRequestsToStorage,
  getDonationsFromStorage,
  saveDonationsToStorage,
  getStoredUser,
} from '../utils/storageFallback';

const REQUESTS_BASE = '/api/requests';
const USE_MOCK = import.meta.env.VITE_MOCK_API === 'true';

function nextId() {
  return String(Date.now());
}

function joinRequestsWithDonations(requests) {
  const donations = getDonationsFromStorage();
  return requests.map((r) => ({
    ...r,
    donation: donations.find((d) => d.id === r.donationId) || { title: 'Unknown', category: '-' },
  }));
}

/**
 * GET /api/requests - list all requests
 */
export const getRequests = async (params = {}) => {
  if (USE_MOCK) {
    await delay(200);
    let list = getRequestsFromStorage();
    if (params.donationId) list = list.filter((r) => r.donationId === params.donationId);
    if (params.status) list = list.filter((r) => r.status === params.status);
    return list;
  }
  try {
    const { data } = await api.get(REQUESTS_BASE, { params });
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      let list = getRequestsFromStorage();
      if (params.donationId) list = list.filter((r) => r.donationId === params.donationId);
      if (params.status) list = list.filter((r) => r.status === params.status);
      return list;
    }
    throw err;
  }
};

/**
 * POST /api/requests - create a request
 * Adds entry to donation.requests (userId, quantityRequested). Keeps request record for My Requests.
 */
export const createRequest = async (payload) => {
  const quantityRequested = Math.max(1, Number(payload.quantityRequested) || 1);
  if (USE_MOCK) {
    await delay(300);
    const user = getStoredUser();
    const userId = user?.id || '1';
    const donations = getDonationsFromStorage();
    const donIdx = donations.findIndex((d) => d.id === payload.donationId);
    if (donIdx !== -1) {
      const d = donations[donIdx];
      const requests = Array.isArray(d.requests) ? [...d.requests] : [];
      const totalRequested = requests.reduce((s, r) => s + (r.quantityRequested || 0), 0);
      const available = (d.quantity ?? 0) - totalRequested;
      if (available < quantityRequested) throw new Error('Not enough quantity available');
      const existing = requests.findIndex((r) => r.userId === userId);
      if (existing >= 0) {
        requests[existing].quantityRequested = (requests[existing].quantityRequested || 0) + quantityRequested;
      } else {
        requests.push({ userId, quantityRequested });
      }
      donations[donIdx] = { ...d, requests };
      saveDonationsToStorage(donations);
    }
    const newReq = {
      id: nextId(),
      donationId: payload.donationId,
      message: payload.message,
      quantityRequested,
      requesterId: userId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    const list = getRequestsFromStorage();
    list.unshift(newReq);
    saveRequestsToStorage(list);
    return newReq;
  }
  try {
    const { data } = await api.post(REQUESTS_BASE, { ...payload, quantityRequested });
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(300);
      const user = getStoredUser();
      const userId = user?.id || '1';
      const donations = getDonationsFromStorage();
      const donIdx = donations.findIndex((d) => d.id === payload.donationId);
      if (donIdx !== -1) {
        const d = donations[donIdx];
        const requests = Array.isArray(d.requests) ? [...d.requests] : [];
        const totalRequested = requests.reduce((s, r) => s + (r.quantityRequested || 0), 0);
        const available = (d.quantity ?? 0) - totalRequested;
        if (available < quantityRequested) throw new Error('Not enough quantity available');
        const existing = requests.findIndex((r) => r.userId === userId);
        if (existing >= 0) {
          requests[existing].quantityRequested = (requests[existing].quantityRequested || 0) + quantityRequested;
        } else {
          requests.push({ userId, quantityRequested });
        }
        donations[donIdx] = { ...d, requests };
        saveDonationsToStorage(donations);
      }
      const newReq = {
        id: nextId(),
        donationId: payload.donationId,
        message: payload.message,
        quantityRequested,
        requesterId: userId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      const list = getRequestsFromStorage();
      list.unshift(newReq);
      saveRequestsToStorage(list);
      return newReq;
    }
    throw err;
  }
};

/**
 * GET /api/requests/my - current user's requests (persisted from localStorage when offline)
 */
export const getMyRequests = async () => {
  if (USE_MOCK) {
    await delay(200);
    const user = getStoredUser();
    const list = getRequestsFromStorage().filter((r) => r.requesterId === user?.id);
    return joinRequestsWithDonations(list);
  }
  try {
    const { data } = await api.get(`${REQUESTS_BASE}/my`);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      const user = getStoredUser();
      const list = getRequestsFromStorage().filter((r) => r.requesterId === user?.id);
      return joinRequestsWithDonations(list);
    }
    throw err;
  }
};

/**
 * PATCH /api/requests/:id
 */
export const updateRequest = async (id, payload) => {
  if (USE_MOCK) {
    await delay(200);
    const list = getRequestsFromStorage();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Request not found');
    list[idx] = { ...list[idx], ...payload };
    saveRequestsToStorage(list);
    return list[idx];
  }
  try {
    const { data } = await api.patch(`${REQUESTS_BASE}/${id}`, payload);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      const list = getRequestsFromStorage();
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error('Request not found');
      list[idx] = { ...list[idx], ...payload };
      saveRequestsToStorage(list);
      return list[idx];
    }
    throw err;
  }
};

/**
 * GET /api/requests/accepted - for coordinator
 */
export const getAcceptedRequests = async () => {
  if (USE_MOCK) {
    await delay(200);
    const list = getRequestsFromStorage().filter((r) => r.status === 'ACCEPTED');
    return joinRequestsWithDonations(list);
  }
  try {
    const { data } = await api.get(`${REQUESTS_BASE}/accepted`);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      const list = getRequestsFromStorage().filter((r) => r.status === 'ACCEPTED');
      return joinRequestsWithDonations(list);
    }
    throw err;
  }
};
