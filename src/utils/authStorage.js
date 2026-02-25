/**
 * localStorage-based auth storage.
 * Keys: "users" (array), "currentUser" (object)
 */

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

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
  } catch (_) {}
}

export function getUsers() {
  const list = safeParse(USERS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function saveUsers(users) {
  if (Array.isArray(users)) safeSet(USERS_KEY, users);
}

export function getCurrentUser() {
  return safeParse(CURRENT_USER_KEY, null);
}

export function setCurrentUser(user) {
  if (user) safeSet(CURRENT_USER_KEY, user);
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
