import api from './api';

// GET: Ambil semua prompt milik user
export const getMyPrompts = async (userId) => {
  try {
    const response = await api.get(`/personal/read.php?user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// POST: Buat prompt baru
export const createPrompt = async (data) => {
  try {
    const response = await api.post('/personal/create.php', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Create Failed');
  }
};

// DELETE: Hapus prompt
export const deletePrompt = async (id, userId) => {
  try {
    const response = await api.post(`/personal/delete.php?id=${id}&user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Delete Failed');
  }
};

// Ambil List Favorit
export const getFavorites = async (userId) => {
  try {
    const response = await api.get(`/personal/favorite.php?action=list&user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Toggle Favorit (Simpan/Hapus)
export const toggleFavorite = async (userId, promptId) => {
  try {
    const response = await api.post('/personal/favorite.php?action=toggle', {
        user_id: userId,
        prompt_id: promptId
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to toggle');
  }
};

export const getFavoritePrompts = async (userId) => {
    try {
        const response = await api.get(`/personal/get_favorites.php?user_id=${userId}&t=${new Date().getTime()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};