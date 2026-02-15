import api from './api';

export interface Bookmark {
  _id: string;
  userId: string;
  itemId: string;
  itemType: 'Course' | 'Chapter';
  url: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  createdAt: string;
}

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const response = await api.get('/api/bookmarks');
  return response.data;
};

export const addBookmark = async (data: {
  itemId: string;
  itemType: 'Course' | 'Chapter';
  url: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}): Promise<Bookmark> => {
  const response = await api.post('/api/bookmarks', data);
  return response.data;
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await api.delete(`/api/bookmarks/${id}`);
};

export const checkBookmark = async (itemId: string): Promise<{ isBookmarked: boolean; bookmark?: Bookmark }> => {
  const response = await api.get(`/api/bookmarks/check/${itemId}`);
  return response.data;
};
