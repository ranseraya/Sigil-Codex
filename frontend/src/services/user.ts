import api from './api';

export const getUserStats = async (userId: number) => {
  try {
    const response = await api.get(`/user/stats.php?user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};