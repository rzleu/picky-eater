export const RECEIVE_RESTAURANTS = 'RECEIVE_RESTAURANTS';

export const receiveRestaurants = (restaurants) => ({
  type: RECEIVE_RESTAURANTS,
  restaurants,
});

// export const fetchRestaurants = () => (dispatch) =>
//   RestaurantUtil.fetchRestaurants().then((res) =>
//     dispatch(receiveRestaurants(res)),
//   );
