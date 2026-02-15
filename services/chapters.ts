import api from './api';

export interface Chapter {
  _id: string;
  title: string;
  content: string;
  courseId: string;
  order: number;
  readingTime: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getChaptersByCourse = async (courseId: string): Promise<Chapter[]> => {
  const response = await api.get(`/api/chapters/course/${courseId}`);
  return response.data;
};

export const getChapterById = async (id: string): Promise<Chapter> => {
  const response = await api.get(`/api/chapters/${id}`);
  return response.data;
};
