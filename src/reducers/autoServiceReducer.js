import {FETCH_AUTO_SERVICE} from '../actions';
import {FETCH_TOW_TRUCK} from '../actions';

const INITIAL_STATE  = {};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_AUTO_SERVICE:
            return action.payload;
        case FETCH_TOW_TRUCK:
            return action.payload;
        default:
            return state;
    }
};