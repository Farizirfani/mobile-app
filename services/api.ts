import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - will be handled by auth context
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Dashboard ───────────────────────────────────────────────
export const getDashboard = async (): Promise<any> => {
  const { data } = await api.get('/dashboard');
  return data;
};

// ─── Courses ─────────────────────────────────────────────────
export const getCourses = async (category?: string): Promise<any[]> => {
  const params = category ? { category } : {};
  const { data } = await api.get('/courses', { params });
  return data;
};

export const getCourseById = async (id: string): Promise<any> => {
  const { data } = await api.get(`/courses/${id}`);
  return data;
};

// ─── Chapters ────────────────────────────────────────────────
export const getChaptersByCourse = async (courseId: string): Promise<any[]> => {
  const { data } = await api.get(`/chapters/course/${courseId}`);
  return data;
};

export const getChapterById = async (id: string): Promise<any> => {
  const { data } = await api.get(`/chapters/${id}`);
  return data;
};

// ─── Progress ────────────────────────────────────────────────
export const getProgress = async (): Promise<any[]> => {
  const { data } = await api.get('/progress');
  return data;
};

export const getProgressByCourse = async (courseId: string): Promise<any> => {
  const { data } = await api.get(`/progress/course/${courseId}`);
  return data;
};

export const updateProgress = async (payload: {
  courseId: string;
  chapterId?: string;
  percentage?: number;
  studyHours?: number;
}): Promise<any> => {
  const { data } = await api.put('/progress', payload);
  return data;
};

export const getStudyHours = async (): Promise<{ totalStudyHours: number; courses: number }> => {
  const { data } = await api.get('/progress/study-hours');
  return data;
};

export const getCourseProgress = async (courseId: string): Promise<any> => {
    // This might be a custom endpoint or helper relying on getProgressByCourse
    // existing mobile code used `getCourseProgress`, let's map it or ensure it exists
    return getProgressByCourse(courseId);
}

// ─── User ────────────────────────────────────────────────────
export const updateProfile = async (payload: {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
}): Promise<{ user: any }> => {
  const { data } = await api.put('/users/profile', payload);
  return data;
};

export const changePassword = async (payload: {
  currentPassword?: string;
  newPassword?: string;
}): Promise<void> => {
  await api.put('/users/change-password', payload);
};

export const toggleBookmark = async (courseId: string): Promise<{ bookmarked: boolean }> => {
  const { data } = await api.post(`/courses/${courseId}/bookmark`);
  return data;
};
