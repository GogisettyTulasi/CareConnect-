/**
 * Mock data for development when Spring Boot backend is not running.
 * Used only by service layer - components never import this.
 */

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const MOCK_USERS = [
  { id: '1', email: 'user@careconnect.com', name: 'Demo User', role: 'USER' },
  { id: '2', email: 'admin@careconnect.com', name: 'Admin User', role: 'ADMIN' },
  { id: '3', email: 'coord@careconnect.com', name: 'Coordinator', role: 'COORDINATOR' },
];

export const MOCK_DONATIONS = [
  { id: '1', title: 'Rice & Lentils', category: 'Food', description: 'Unopened bags, long-grain white rice and red lentils.', quantity: 2, donorId: '1', location: 'Downtown Community Center', createdAt: '2025-02-20T10:00:00Z', requests: [{ userId: '2', quantityRequested: 1 }] },
  { id: '2', title: 'Winter Jackets', category: 'Clothes', description: 'Adult sizes M–L, gently used.', quantity: 5, donorId: '1', location: 'Northside Shelter', createdAt: '2025-02-19T14:00:00Z', requests: [] },
  { id: '3', title: 'Canned Goods', category: 'Food', description: 'Various cans: beans, tomatoes, soup.', quantity: 10, donorId: '2', location: 'West End Food Bank', createdAt: '2025-02-18T09:00:00Z', requests: [{ userId: '1', quantityRequested: 3 }, { userId: '3', quantityRequested: 2 }] },
  { id: '4', title: 'Children\'s Books', category: 'Books', description: 'Picture books and early readers, good condition.', quantity: 15, donorId: '1', location: 'Central Library', createdAt: '2025-02-17T11:00:00Z', requests: [] },
  { id: '5', title: 'Blankets & Bedding', category: 'Other', description: 'Clean blankets and pillow sets.', quantity: 4, donorId: '2', location: 'Downtown Community Center', createdAt: '2025-02-16T08:30:00Z', requests: [{ userId: '3', quantityRequested: 4 }] },
  { id: '6', title: 'Baby Formula & Diapers', category: 'Other', description: 'Unopened formula, size 2–3 diapers.', quantity: 6, donorId: '1', location: 'Northside Shelter', createdAt: '2025-02-15T16:00:00Z', requests: [] },
  { id: '7', title: 'School Supplies', category: 'Other', description: 'Notebooks, pens, backpacks.', quantity: 20, donorId: '3', location: 'East Side Resource Hub', createdAt: '2025-02-14T09:00:00Z', requests: [{ userId: '1', quantityRequested: 5 }] },
  { id: '8', title: 'Coats & Scarves', category: 'Clothes', description: 'Winter coats and wool scarves, all ages.', quantity: 8, donorId: '2', location: 'West End Food Bank', createdAt: '2025-02-13T14:00:00Z', requests: [{ userId: '2', quantityRequested: 2 }] },
  { id: '9', title: 'Pasta & Sauce', category: 'Food', description: 'Dry pasta and jarred tomato sauce.', quantity: 12, donorId: '1', location: 'Central Library', createdAt: '2025-02-12T10:00:00Z', requests: [] },
  { id: '10', title: 'Stuffed Toys', category: 'Toys', description: 'Clean plush toys for kids.', quantity: 7, donorId: '3', location: 'Downtown Community Center', createdAt: '2025-02-11T11:00:00Z', requests: [] },
  { id: '11', title: 'Desk Lamp', category: 'Electronics', description: 'LED desk lamp, working.', quantity: 1, donorId: '2', location: 'East Side Resource Hub', createdAt: '2025-02-10T15:00:00Z', requests: [] },
  { id: '12', title: 'Cereal & Oatmeal', category: 'Food', description: 'Boxed cereal and instant oatmeal packets.', quantity: 5, donorId: '1', location: 'Northside Shelter', createdAt: '2025-02-09T09:00:00Z', requests: [] },
];

export const MOCK_REQUESTS = [
  { id: '1', donationId: '1', requesterId: '2', status: 'PENDING', message: 'Need for family', createdAt: '2025-02-20T11:00:00Z' },
  { id: '2', donationId: '3', requesterId: '1', status: 'ACCEPTED', message: 'Shelter need', createdAt: '2025-02-19T12:00:00Z' },
];

export function getMockAuth(email, password) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user || password !== 'password') return null;
  return { token: 'mock-jwt-' + user.id, user };
}

export function getMockDonations() {
  return [...MOCK_DONATIONS];
}

export function getMockRequests() {
  return [...MOCK_REQUESTS];
}

export { delay };
