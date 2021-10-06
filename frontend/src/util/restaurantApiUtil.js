import axios from 'axios';

export const saveRestaurant = (restaurant, userId) => {
  return axios.post('/api/users/saved', { restaurant, userId });
};
