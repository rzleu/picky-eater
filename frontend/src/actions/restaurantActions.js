import * as RestaurantAPIUtil from '../util/restaurantApiUtil';

export const RECEIVE_RESTAURANT = 'RECEIVE_RESTAURANT';
export const RECEIVE_RESTAURANTS = 'RECEIVE_RESTAURANTS';

export const receiveRestaurant = (restaurant, userId) => ({
  type: RECEIVE_RESTAURANT,
  restaurant,
  userId,
});

export const receiveRestaurants = (restaurants) => ({
  type: RECEIVE_RESTAURANTS,
  restaurants,
});

export const saveRestaurant = (restaurant, userId) => (dispatch) => {
  RestaurantAPIUtil.saveRestaurant(restaurant, userId).then(
    ({ data: { restaurant, userId } }) =>
      dispatch(receiveRestaurant(restaurant, userId)),
  );
};
