import api from './api';

export interface Progress {
  _id: string;
  userId: string;
  courseId: string;
  chapterId: string;
  percentage: number;
  studyHours: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const getProgress = async (): Promise<Progress[]> => {
  const response = await api.get('/api/progress');
  return response.data;
};

export const updateProgress = async (data: {
  courseId: string;
  chapterId?: string;
  percentage?: number;
  studyHours?: number;
}): Promise<Progress> => {
  const response = await api.put('/api/progress', data);
  return response.data;
};

export const getStudyHours = async (): Promise<{ totalStudyHours: number; courses: number }> => {
  const response = await api.get('/api/progress/study-hours');
  return response.data;
};

export const getCourseProgress = async (courseId: string): Promise<Progress> => {
  const response = await api.get(`/api/progress/course/${courseId}`);
  return response.data;
};
