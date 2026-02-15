import api from './api';

export interface DashboardData {
  examReadiness: number;
  continueReading: {
    course: any;
    chapter: any;
    progress: number;
  };
  continueLearning: Array<{
    course: any;
    percentage: number;
  }>;
  totalStudyHours: number;
  totalCourses: number;
  completedCourses: number;
}

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get('/api/dashboard');
  return response.data;
};
