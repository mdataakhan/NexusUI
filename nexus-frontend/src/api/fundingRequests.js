import { API } from "./auth";

// Fetch a single funding request by its id
export const getFundingRequestById = (id) => API.get(`/api/v1/funding-requests/${id}`);

// Fallback: fetch funding requests for a user if backend exposes this route
export const getFundingRequestsByUser = (userId) => API.get(`/api/v1/funding-requests/${userId}`);

// Create a new funding request
export const createFundingRequest = (body) => API.post(`/api/v1/funding-requests`, body);

// Fetch funding requests for the logged-in user
export const getMyFundingRequests = () => API.get(`/api/v1/funding-requests/mine`);
