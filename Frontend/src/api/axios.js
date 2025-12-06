import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/v1', // Proxy to http://localhost:8000/api/v1
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('user');
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
