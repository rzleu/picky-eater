import * as SessionAPIUtil from '../util/sessionApiUtil';
import jwt_decode from 'jwt-decode';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';
export const RECEIVE_USER_LOGOUT = 'RECEIVE_USER_LOGOUT';
export const RECEIVE_USER_SIGN_IN = 'RECEIVE_USER_SIGN_IN';

export const receiveCurrentUser = (currentUser) => ({
  type: RECEIVE_CURRENT_USER,
  currentUser,
});

export const receiveUserSignIn = (currentUser) => ({
  type: RECEIVE_USER_SIGN_IN,
  currentUser,
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_SESSION_ERRORS,
  errors,
});

export const logoutUser = () => ({
  type: RECEIVE_USER_LOGOUT,
});

export const signup = (user) => (dispatch) =>
  SessionAPIUtil.signup(user).then(
    ({ data: { payload } }) => dispatch(receiveCurrentUser(payload)),
    (err) => dispatch(receiveErrors(err.response.data)),
  );

export const login = (user) => (dispatch) =>
  SessionAPIUtil.login(user)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      SessionAPIUtil.setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(receiveUserSignIn(decoded));
      return res;
    })
    .catch((err) => {
      dispatch(receiveErrors(err.response.data));
    });

export const logout = () => (dispatch) => {
  localStorage.removeItem('jwtToken');
  SessionAPIUtil.setAuthToken(false);
  dispatch(logoutUser());
};

export const fetchUser = (userId) => (dispatch) =>
  SessionAPIUtil.fetchUser(userId).then(
    (user) => dispatch(receiveCurrentUser(user.data)),
    (err) => dispatch(receiveErrors(err.response.data)),
  );
