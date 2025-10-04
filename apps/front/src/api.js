import axios from 'axios';

// Create axios instance with WordPress REST API configuration
const api = axios.create({
    baseURL: window.waypointData?.apiUrl || '/wp-json/gateway',
    headers: {
        'X-WP-Nonce': window.waypointData?.nonce || '',
    },
    withCredentials: true, // Enable cookie authentication
});

export default api;
