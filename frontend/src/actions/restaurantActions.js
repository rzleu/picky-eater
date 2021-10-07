import * as RestaurantAPIUtil from '../util/restaurantApiUtil';

export const RECEIVE_RESTAURANT = 'RECEIVE_RESTAURANT';

export const receiveRestaurant = (restaurant, userId) => ({
  type: RECEIVE_RESTAURANT,
  restaurant,
  userId,
});

export const saveRestaurant = (restaurant, userId) => (dispatch) => {
  RestaurantAPIUtil.saveRestaurant(restaurant, userId).then(
    ({ data }) => {
      console.log(data);
      dispatch(receiveRestaurant(data, userId));
    },
  );
};
