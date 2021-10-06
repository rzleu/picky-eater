import {
  RECEIVE_RESTAURANT,
  RECEIVE_RESTAURANTS,
} from '../actions/restaurantActions';

const initialState = [];

const RestaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_RESTAURANT:
      return [...state, action.restaurant];
    case RECEIVE_RESTAURANTS:
      return action.restaurants;
    default:
      return state;
  }
};

export default RestaurantReducer;
