import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute } from './util/routeUtil';
import LoginForm from './components/session/Login';
import './util.css';
import './index.css';
import SplashPage from './pages/splashPage/SplashPage';
import SignupForm from './components/session/Signup';
import Lobby from './pages/Lobby/Lobby';

function App() {
  return (
    <div className="h-100">
      <Switch>
        <Route exact path="/" component={SplashPage} />
        <AuthRoute exact path="/login" component={LoginForm} />
        <AuthRoute exact path="/signup" component={SignupForm} />
        {/* Make this authroute later */}
        <Route path="/lobby" component={Lobby} />
      </Switch>
    </div>
  );
}

export default App;
