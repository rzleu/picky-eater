import {
  RECEIVE_CURRENT_USER,
  RECEIVE_USER_LOGOUT,
  RECEIVE_USER_SIGN_IN,
} from '../actions/sessionActions';

import { RECEIVE_RESTAURANT } from '../actions/restaurantActions';

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
      console.log({ action });
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
          saved: [...state.user.saved, action.restaurant],
        },
      };
    default:
      return state;
  }
};

export default SessionReducer;
