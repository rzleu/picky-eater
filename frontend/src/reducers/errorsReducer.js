import { combineReducers } from 'redux';

import SessionErrorsReducer from './sessionErrorsReducer';

export default combineReducers({
  session: SessionErrorsReducer,
});
