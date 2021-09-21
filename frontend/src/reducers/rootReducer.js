import { combineReducers } from 'redux';

import session from './sessionReducer';
import errors from './errorsReducer';
import restaurants from './restaurantsReducer';

const RootReducer = combineReducers({
  session,
  errors,
  restaurants,
});

export default RootReducer;
