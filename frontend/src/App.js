import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import './util.css';
import './index.css';
import SplashPage from './pages/splashPage/SplashPage';
import Lobby from './pages/Lobby/Lobby';
import About from './pages/About/About.jsx';
import { useSelector } from 'react-redux';

function App() {
  const isLoggedIn = useSelector(
    (state) => state.session?.isAuthenticated,
  );
  console.log(isLoggedIn);
  return (
    <div className="h-100">
      <Switch>
        {/* <ProtectedRoute
          path="/"
          component={SplashPage}
          loggedIn={isLoggedIn}
        /> */}
        {isLoggedIn ? (
          <Route path="/" component={Lobby} />
        ) : (
          <Route path="/" component={SplashPage} />
        )}
        {/* <AuthRoute exact path="/" component={LoginForm} />
        <AuthRoute exact path="/" component={SignupForm} /> */}

        {/* Make this authroute later */}
        {/* <Route path="/lobby" component={Lobby} /> */}
        <Route exact path="/about" component={About} />
      </Switch>
    </div>
  );
}

export default App;
