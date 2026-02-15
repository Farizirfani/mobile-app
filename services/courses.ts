import api from './api';

export interface Course {
  [x: string]: unknown;
  _id: string;
  title: string;
  subtitle: string;
  subject: string;
  category: string;
  icon: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const getCourses = async (category?: string): Promise<Course[]> => {
  const params = category ? { category } : {};
  const response = await api.get('/api/courses', { params });
  return response.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await api.get(`/api/courses/${id}`);
  return response.data;
};
