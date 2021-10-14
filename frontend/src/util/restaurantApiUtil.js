import axios from 'axios';

export const saveRestaurant = (restaurant, userId) => {
  return axios.post('/api/users/saved', { restaurant, userId });
};

export const fetchRestaurantExperience = (id, userId, exp) => {
  return axios.put('/api/users/saved', { id, userId, exp });
};

export const deleteRestaurant = (restaurant, userId) => {
  return axios.delete(
    '/api/users/saved',
    {
      data: {
        restaurant,
        userId,
      },
    },
    {
      headers: {
        Authorization: null,
      },
    },
  );
};
