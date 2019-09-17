import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { reducer as toastrReducer } from 'react-redux-toastr';
import auth from './_Resources/Auth/Reducers/auth';

export interface StoreState {}

// Store
export const initialState: StoreState = {};
export const store = createStore<StoreState>(
  combineReducers({
    toastr: toastrReducer,
    auth,
  }),
  initialState,
  devToolsEnhancer({}),
);
