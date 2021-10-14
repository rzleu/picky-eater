import {
  RECEIVE_CURRENT_USER,
  RECEIVE_USER_LOGOUT,
  RECEIVE_USER_SIGN_IN,
} from '../actions/sessionActions';

import {
  RECEIVE_RESTAURANT,
  DELETE_RESTAURANT,
  RECEIVE_RESTAURANT_EXPERIENCE,
} from '../actions/restaurantActions';

const initialState = {
  isAuthenticated: false,
  user: {},
};

const SessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USER_LOGOUT:
      return {
        isAuthenticated: false,
        user: undefined,
      };
    case RECEIVE_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!action.currentUser,
        user: action.currentUser,
      };
    case RECEIVE_USER_SIGN_IN:
      return {
        ...state,
        user: action.currentUser,
        isSignedIn: true,
      };
    case RECEIVE_RESTAURANT:
      return {
        ...state,
        user: {
          ...state.user,
          saved: state.user.saved.concat(action.restaurant),
        },
      };
    case DELETE_RESTAURANT:
      const deleteIdx = state.user.saved.findIndex(
        (res) => res.place_id === action.restaurant,
      );
      return {
        ...state,
        user: {
          ...state.user,
          saved: state.user.saved.filter((_, i) => i !== deleteIdx),
        },
      };
    case RECEIVE_RESTAURANT_EXPERIENCE:
      return {
        ...state,
        user: {
          ...state.user,
          saved: action.response.data,
        },
      };
    default:
      return state;
  }
};

export default SessionReducer;
