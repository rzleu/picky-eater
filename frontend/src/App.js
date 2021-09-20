import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute } from './util/routeUtil';
import LoginForm from './components/session/Login';
import './util.css';
import './index.css';
import SplashPage from './pages/splashPage/SplashPage';

function App() {
  return (
    <div className="h-100">
      <Switch>
        <Route>
          <SplashPage />
        </Route>
        <AuthRoute path="/">
          <LoginForm />
        </AuthRoute>
      </Switch>
    </div>
  );
}

export default App;
