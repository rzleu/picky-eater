import { RECEIVE_RESTAURANTS } from '../actions/restaurantActions';

const initialState = {};

const RestaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_RESTAURANTS:
      return action.restaurants;
    default:
      return state;
  }
};

export default RestaurantReducer;
