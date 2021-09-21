import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import LoginForm from './components/session/Login';
import './util.css';
import './index.css';
import SplashPage from './pages/splashPage/SplashPage';
import SignupForm from './components/session/Signup';
import CardSwipe from './components/lobby/CardSwipe';

function App() {
  return (
    <div className="h-100">
      <Switch>
        <Route exact path="/" component={SplashPage} />
        <AuthRoute exact path="/login" component={LoginForm} />
        <AuthRoute exact path="/signup" component={SignupForm} />
        <Route exact path="/swipe" component={CardSwipe} />
      </Switch>
    </div>
  );
}

export default App;
