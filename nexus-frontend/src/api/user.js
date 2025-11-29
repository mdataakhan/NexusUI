import { API } from "./auth";

export const getUserById = (userId) => API.get(`/api/v1/users/${userId}`);
