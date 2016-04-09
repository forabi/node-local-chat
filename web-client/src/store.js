import { createStore, combineReducers } from 'redux';
import services from './services';

const reducers = combineReducers({
  services: services.reducer,
});

const store = createStore(reducers);

export default store;
