// src/api/hr-directory/index.js
import api from '../index';

export const getContacts = async ({ page = 1, page_size = 10, search = '', company = '', privacy_status = '', ordering = '' }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('page_size', page_size);
  if (search) params.append('search', search);
  if (company) params.append('company', company);
  if (privacy_status) params.append('privacy_status', privacy_status);
  if (ordering) params.append('ordering', ordering);

  const response = await api.get(`/directory/contacts/?${params.toString()}`);
  return response.data;
};

export const getContact = async (id) => {
  const response = await api.get(`/directory/contacts/${id}/`);
  return response.data;
};

export const createContact = async (data) => {
  const response = await api.post('/directory/contacts/', data);
  return response.data;
};

export const updateContact = async (id, data) => {
  const response = await api.patch(`/directory/contacts/${id}/`, data);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/directory/contacts/${id}/`);
  return response.data;
};
