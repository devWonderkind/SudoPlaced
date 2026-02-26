import api from './index';

export const getNotifications = (params = {}) => api.get('notifications/', { params });
export const getMyNotifications = () => getNotifications(); // Alias

export const markNotificationRead = (id) => api.post(`notifications/${id}/mark_read/`);
export const markAllNotificationsRead = () => api.post('notifications/mark_all_read/');
export const deleteNotification = (id) => api.delete(`notifications/${id}/`);
