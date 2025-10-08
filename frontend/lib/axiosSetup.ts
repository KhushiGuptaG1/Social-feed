// lib/axiosInstance.ts
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || '';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export default axiosInstance;