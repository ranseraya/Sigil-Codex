import api from './api';

// Update fungsi getGlobalPrompts untuk terima parameter sort & userId
export const getGlobalPrompts = async (userId: number, sort: string = 'newest') => {
  try {
    const response = await api.get(`/community/explore.php?user_id=${userId}&sort=${sort}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi Baru: Toggle Like
export const toggleLikePrompt = async (userId: number, promptId: number) => {
    try {
      const response = await api.post('/community/toggle_like.php', {
          user_id: userId,
          prompt_id: promptId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };