import {
    EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN, LOGIN_USER_SUCCESS, LOGIN_USER_FAILED
} from '../actions';

const INITIAL_STATE = {
    email: '',
    password: '',
    res: {},
    isAut: false,
    spinnerStatus: false

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EMAIL_CHANGED:
            return {...state, email: action.payload};
        case PASSWORD_CHANGED:
            return {...state, password: action.payload};
        case LOGIN_USER_SUCCESS:
            return {...state, res: action.payload, isAut: true, spinnerStatus: false};
        case LOGIN:
            return {...state, isAut: false, spinnerStatus: true};
        case LOGIN_USER_FAILED:
            return {...state, isAut: false, spinnerStatus: false};
        default:
            return state;
    }
}
