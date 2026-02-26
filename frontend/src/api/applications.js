import api from "./index";

export const getApplications = async (params) => {
  const response = await api.get("applications/", { params });
  return response.data;
};

export const getApplication = async (id) => {
  const response = await api.get(`applications/${id}/`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post("applications/", data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await api.patch(`applications/${id}/`, data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`applications/${id}/`);
  return response.data;
};

export const getApplicationStatuses = async () => {
    const response = await api.get("statuses/");
    return response.data;
};

export const restoreDefaultStatuses = async () => {
    const response = await api.post("statuses/restore_defaults/");
    return response.data;
};
