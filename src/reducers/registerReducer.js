import {
    NAME_CHANGED, SURNAME_CHANGED, REGISTER_EMAIL_CHANGED,
    REGISTER_PHONE_CHANGED, REGISTER_PASSWORD_CHANGED, REGISTER, CUSTOMER_CREATE,
    CUSTOMER_CREATE_FAILED
} from '../actions';

const INITIAL_STATE = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    spinnerStatus: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NAME_CHANGED:
            return {...state, name: action.payload};
        case SURNAME_CHANGED:
            return {...state, surname: action.payload};
        case REGISTER_EMAIL_CHANGED:
            return {...state, email: action.payload};
        case REGISTER_PHONE_CHANGED:
            return {...state, phone: action.payload};
        case REGISTER_PASSWORD_CHANGED:
            return {...state, password: action.payload};
        case REGISTER:
            return {...state, spinnerStatus: false };
        case CUSTOMER_CREATE:
            return {...state, spinnerStatus: true};
        case CUSTOMER_CREATE_FAILED:
            return {...state, spinnerStatus: false};
        default:
            return state;
    }
}