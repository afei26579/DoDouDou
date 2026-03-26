export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_V1_PREFIX = '/api/v1';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_V1_PREFIX}/auth/login`,
  REGISTER: `${API_V1_PREFIX}/auth/register`,
  REFRESH: `${API_V1_PREFIX}/auth/refresh`,

  // Users
  ME: `${API_V1_PREFIX}/users/me`,
  UPDATE_PREFERENCES: `${API_V1_PREFIX}/users/me/preferences`,

  // Convert
  CONVERT_UPLOAD: `${API_V1_PREFIX}/convert/upload`,
  CONVERT_GENERATE: `${API_V1_PREFIX}/convert/generate`,

  // Works
  WORKS: `${API_V1_PREFIX}/works`,
  WORK_DETAIL: (id: string) => `${API_V1_PREFIX}/works/${id}`,
  WORK_FOLLOW_STEPS: (id: string) => `${API_V1_PREFIX}/works/${id}/follow-steps`,

  // Templates
  TEMPLATES: `${API_V1_PREFIX}/templates`,
  TEMPLATE_DETAIL: (id: string) => `${API_V1_PREFIX}/templates/${id}`,

  // Palettes
  PALETTES: `${API_V1_PREFIX}/palettes`,
  PALETTE_DETAIL: (id: string) => `${API_V1_PREFIX}/palettes/${id}`,
};
