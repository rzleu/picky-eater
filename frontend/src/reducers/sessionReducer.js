import { 
  RECEIVE_CURRENT_USER,
  RECEIVE_USER_LOGOUT, 
  RECEIVE_USER_SIGN_IN 
} from "../actions/sessionActions";

const initialState = {
  isAuthenticated: false,
  user: {}
};

const SessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USER_LOGOUT:
      return {
        isAuthenticated: false,
        user: undefined
      };
    default:
      return state;
  }
}

export default SessionReducer;