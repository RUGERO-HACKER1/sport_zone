import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // 1. Check for explicit environment variable
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  // 2. Use the known LAN IP from your logs (Most reliable for physical devices)
  // Based on your logs: exp://192.168.1.250:8081
  const LAN_IP = '192.168.1.250';
  return `http://${LAN_IP}:5000`;
};

export const API_BASE_URL = getBaseUrl();

type ApiOptions = RequestInit & { skipJson?: boolean };

const parseResponse = async (response: Response, skipJson?: boolean) => {
  if (skipJson) {
    return response;
  }

  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

export const apiFetch = async (path: string, options: ApiOptions = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await parseResponse(response, options.skipJson);

  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
};

export const buildAuthHeaders = (token?: string | null) =>
  token
    ? {
      Authorization: `Bearer ${token}`,
    }
    : {};
