import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const AuthRoute = ({ component: Component, path, exact }) => {
  const isLoggedIn = useSelector((state) => state.session);
  console.log({ isLoggedIn });
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) =>
        !(isLoggedIn?.isAuthenticated || isLoggedIn?.isSignedIn) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/lobby" />
        )
      }
    />
  );
};

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = useSelector((state) => state.session);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn?.isAuthenticated || isLoggedIn?.isSignedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
