/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import reducers from './reducers';
import Router from './router';
import ReduxThunk from 'redux-thunk';


export default class App extends Component {

    render() {
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
        return (
            <Provider store= {store}>
                <Router />
            </Provider>

    );
  }
}