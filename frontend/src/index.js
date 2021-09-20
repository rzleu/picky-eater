import { fetchAllRestaurants } from './actions/restaurantActions';
import React from 'react';
import ReactDOM from 'react-dom';
// import Root from './components/root';
import configureStore from './store/store';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from './util/sessionApiUtil';
import { logout } from './actions/sessionActions';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  window.fetchAllRestaurants = fetchAllRestaurants;
  let store;

  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decodedUser = jwt_decode(localStorage.jwtToken);
    const preloadedState = {
      session: { isAuthenticated: true, user: decodedUser },
    };
    store = configureStore(preloadedState);
    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
  } else {
    store = configureStore({});
  }
  const root = document.getElementById('root');
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>,
    root,
  );
});
