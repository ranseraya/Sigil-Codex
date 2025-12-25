import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login.php', { email, password });
    if (response.data.status === 'success') {
      // Simpan data user ke HP
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register.php', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('user');
};