import * as RestaurantAPIUtil from '../util/restaurantApiUtil';

export const RECEIVE_RESTAURANT = 'RECEIVE_RESTAURANT';
export const DELETE_RESTAURANT = 'DELETE_RESTAURANT';

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
      console.log(data);
      dispatch(receiveRestaurant(data, userId));
    },
  );
};

export const deleteRestaurant =
  (restaurant, userId) => (dispatch) => {
    console.log({ restaurant, userId });
    RestaurantAPIUtil.deleteRestaurant(restaurant, userId).then(
      () => {
        dispatch(deleteRestaurantPojo(restaurant, userId));
      },
    );
  };
