import { applyMiddleware, createStore, combineReducers, compose } from "redux";
import thunk from "redux-thunk";

let store;
export default function() {
  const composeEnhancers =
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = store
    ? store
    : createStore(
        combineReducers(global.reducers),
        composeEnhancers(applyMiddleware(thunk))
      );
  return store;
}
