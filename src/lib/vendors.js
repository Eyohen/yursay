import { api } from './api';

export const getCategories = () => api.get('/lookup/categories').then((r) => r.data.data);
export const getCities = () => api.get('/lookup/cities').then((r) => r.data.data);

export const searchVendors = (params = {}) =>
  api.get('/vendors', { params }).then((r) => r.data);

export const getVendor = (id) => api.get(`/vendors/${id}`).then((r) => r.data.data);

export const createVendor = (payload) => api.post('/vendors', payload).then((r) => r.data.data);

export const claimVendor = (id) => api.post(`/vendors/${id}/claim`).then((r) => r.data.data);

export const updateVendor = (id, payload) => api.put(`/vendors/${id}`, payload).then((r) => r.data.data);

export const getMyVendor = () => api.get('/vendors/mine/owned').then((r) => r.data.data);

export const getVendorReviews = (vendorId, params = {}) =>
  api.get(`/reviews/vendor/${vendorId}`, { params }).then((r) => r.data);

export const getRecentReviews = (params = {}) =>
  api.get('/reviews/recent', { params }).then((r) => r.data.data);

export const getMyReviews = () => api.get('/reviews/mine').then((r) => r.data.data);

export const createReview = (payload) => api.post('/reviews', payload).then((r) => r.data.data);

export const respondToReview = (id, response) =>
  api.post(`/reviews/${id}/respond`, { response }).then((r) => r.data.data);

export const flagReview = (id, reason) =>
  api.post(`/reviews/${id}/flag`, { reason }).then((r) => r.data);

export const markReviewHelpful = (id) => api.post(`/reviews/${id}/helpful`).then((r) => r.data.data);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data.url);
};

export const getSavedVendors = () => api.get('/saved-vendors').then((r) => r.data.data);
export const saveVendor = (vendorId) => api.post(`/saved-vendors/${vendorId}`).then((r) => r.data.data);
export const unsaveVendor = (vendorId) => api.delete(`/saved-vendors/${vendorId}`).then((r) => r.data);

// ── Adapters: map API shapes onto the display shape the UI components expect ──

const GRADIENTS = [
  'linear-gradient(135deg,#7c3aed,#a855f7)', 'linear-gradient(135deg,#ea580c,#f97316)',
  'linear-gradient(135deg,#16a34a,#22c55e)', 'linear-gradient(135deg,#305d73,#4a7d96)',
  'linear-gradient(135deg,#e11d48,#f43f5e)', 'linear-gradient(135deg,#0891b2,#06b6d4)',
  'linear-gradient(135deg,#d97706,#f59e0b)',
];
const AVATAR_CLASSES = [
  'bg-[#e5f4fb] text-[#305d73]', 'bg-[#fff3cf] text-[#c78216]', 'bg-[#e3ffb3] text-[#65a91d]',
  'bg-[#f4e5fb] text-[#7c3aed]', 'bg-[#ffe4e6] text-[#e11d48]',
];

const hashString = (str = '') => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

const initialsFor = (name = '') => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'YS';

export const gradientFor = (id = '') => GRADIENTS[hashString(id) % GRADIENTS.length];

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
};

export const adaptVendor = (v) => ({
  id: v.id,
  initials: initialsFor(v.name),
  name: v.name,
  category: v.category?.name || 'Uncategorized',
  categoryId: v.categoryId,
  location: v.city ? [v.city.name, v.city.state?.name].filter(Boolean).join(', ') : (v.address || ''),
  rating: Number(v.avgRating) || 0,
  reviewCount: v.reviewCount || 0,
  trustScore: v.trustScore || 0,
  tags: [],
  gradient: gradientFor(v.id),
  verified: v.verificationStatus === 'verified',
  verificationStatus: v.verificationStatus,
  handle: v.handle || '',
  description: v.description || '',
  phone: v.phone,
  whatsapp: v.whatsapp,
  businessHours: v.businessHours,
  ownerUserId: v.ownerUserId,
});

export const adaptReview = (r) => {
  const displayName = r.isAnonymous ? 'Anonymous Reviewer' : (r.reviewer?.name || 'YurSay User');
  return {
    id: r.id,
    name: displayName,
    location: '',
    rating: r.rating,
    body: r.content,
    tags: r.tags || [],
    avatarClass: AVATAR_CLASSES[hashString(r.id) % AVATAR_CLASSES.length],
    initials: initialsFor(displayName),
    verified: r.reviewer?.verified || false,
    date: timeAgo(r.createdAt),
    helpful: r.helpfulCount || 0,
    hasPhotos: Boolean(r.orderedPhotoUrl || r.gotPhotoUrl || (r.additionalPhotos || []).length),
    reply: r.vendorResponse ? { owner: r.vendor?.name || 'the business', text: r.vendorResponse } : null,
    ovg: (r.orderedPhotoUrl || r.gotPhotoUrl)
      ? { orderedPhotoUrl: r.orderedPhotoUrl, gotPhotoUrl: r.gotPhotoUrl, match: true }
      : undefined,
    vendor: r.vendor,
  };
};
