import axios from 'axios';

export const saveRestaurant = (restaurant, userId) => {
  return axios.post('/api/users/saved', { restaurant, userId });
};

export const deleteRestaurant = (restaurant, userId) => {
  console.log({ restaurant });
  return axios({
    method: 'DELETE',
    url: '/api/users/saved',
    data: {
      restaurant,
      userId,
    },
  });
};
