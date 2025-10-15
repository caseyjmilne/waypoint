import axios from 'axios';

// Create axios instance with WordPress REST API configuration
const api = axios.create({
    baseURL: window.waypointData?.apiUrl || '/wp-json/gateway/v1',
    headers: {
        'X-WP-Nonce': window.waypointData?.nonce || '',
    },
    withCredentials: true, // Enable cookie authentication
});

export default api;
