import { FETCH_MASTER_PROFILE, FETCH_CUSTOMER_PROFILE } from '../actions';

const INITIAL_STATE = {
    profileDetail: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_MASTER_PROFILE:
            return {profileDetail: action.payload};
        case FETCH_CUSTOMER_PROFILE:
            return {profileDetail: action.payload};
        default:
            return state;
    }
};