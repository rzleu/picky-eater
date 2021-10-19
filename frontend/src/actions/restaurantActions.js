import * as RestaurantAPIUtil from '../util/restaurantApiUtil';
import axios from 'axios';
import { setAuthToken } from '../util/sessionApiUtil';
export const RECEIVE_RESTAURANT = 'RECEIVE_RESTAURANT';
export const DELETE_RESTAURANT = 'DELETE_RESTAURANT';
export const RECEIVE_RESTAURANT_EXPERIENCE =
  'RECEIVE_RESTAURANT_EXPERIENCE';

export const receiveRestaurantExperience = (
  id,
  userId,
  exp,
  response,
) => ({
  type: RECEIVE_RESTAURANT_EXPERIENCE,
  id,
  userId,
  exp,
  response,
});

export const receiveRestaurant = (restaurant, userId) => ({
  type: RECEIVE_RESTAURANT,
  restaurant,
  userId,
});

export const deleteRestaurantPojo = (restaurant, userId) => ({
  type: DELETE_RESTAURANT,
  userId,
  restaurant,
});

export const saveRestaurant = (restaurant, userId) => (dispatch) => {
  RestaurantAPIUtil.saveRestaurant(restaurant, userId).then(
    ({ data }) => {
      dispatch(receiveRestaurant(data, userId));
    },
  );
};

export const deleteRestaurant =
  (restaurant, userId) => (dispatch) => {
    delete axios.defaults.headers.common['Authorization'];
    RestaurantAPIUtil.deleteRestaurant(restaurant, userId)
      .then(() => {
        dispatch(deleteRestaurantPojo(restaurant, userId));
      })
      .catch((response) => console.error(response));
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
    }
  };

export const fetchRestaurantExperience =
  (id, userId, exp) => (dispatch) => {
    RestaurantAPIUtil.fetchRestaurantExperience(id, userId, exp).then(
      (response) => {
        dispatch(
          receiveRestaurantExperience(id, userId, exp, response),
        );
      },
    );
  };
