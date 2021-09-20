import { combineReducers } from "redux";

import session from './sessionReducer';

const RootReducer = combineReducers({
  session
});

export default RootReducer;