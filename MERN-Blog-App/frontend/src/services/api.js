import axios from 'axios';

const baseURL = process.env.REACT_APP_BASEURL ;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    mode: 'cors'
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios response error:", {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url
    });

    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getPosts = (page = 1) => api.get(`/api/posts?page=${page}`);
export const getPost = (id) => api.get(`/api/posts/${id}`);
export const createPost = (data) => api.post('/api/posts', data);
export const updatePost = (id, data) => api.put(`/api/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/api/posts/${id}`);
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);
export const getProfile = () => api.get('/api/auth/profile');

export default api; 
