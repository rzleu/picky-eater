import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './util/routeUtil';
import './util.css';
import './index.css';
import SplashPage from './pages/splashPage/SplashPage';
import Lobby from './pages/Lobby/Lobby';
import About from './pages/About/About.jsx';

function App() {
  return (
    <div className="h-100">
      <Switch>
        <ProtectedRoute exact path="/lobby" component={Lobby} />
        <AuthRoute exact path="/" component={SplashPage} />
        <Route exact path="/about" component={About} />
      </Switch>
    </div>
  );
}

export default App;
