import api from './api';

export const getCollections = async (userId: number) => {
  try {
    const random = Math.floor(Math.random() * 1000); 
    const response = await api.get(`/personal/get_collections.php?user_id=${userId}&_r=${random}`);
    return response.data;
  } catch (error) {
    return { status: 'error', error, data: [] };
  }
};

export const createCollection = async (userId: number, name: string) => {
  try {
    const response = await api.post('/personal/create_collection.php', {
      user_id: userId,
      name: name
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCollection = async (id: number) => {
    try {
        const response = await api.post('/personal/delete_collection.php', { id });
        return response.data;
    } catch (error) {
        throw error;
    }
};