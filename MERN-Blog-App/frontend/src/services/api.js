import axios from 'axios';

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5100";

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPosts = (page = 1) => api.get(`/server/posts?page=${page}`);
export const getPost = (id) => api.get(`/server/posts/${id}`);
export const createPost = (data) => api.post('/server/posts', data);
export const updatePost = (id, data) => api.put(`/server/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/server/posts/${id}`);
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');

export default api; 