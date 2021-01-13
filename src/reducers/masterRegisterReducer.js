import {
    MASTER_NAME_CHANGED, MASTER_SURNAME_CHANGED,
    MASTER_REGISTER_EMAIL_CHANGED, MASTER_REGISTER_PHONE_CHANGED,
    MASTER_REGISTER_PASSWORD_CHANGED, MASTER_REGISTER,
    MASTER_CREATE, MASTER_CREATE_FAILED
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
        case MASTER_NAME_CHANGED:
            return {...state, name: action.payload};
        case MASTER_SURNAME_CHANGED:
            return {...state, surname: action.payload};
        case MASTER_REGISTER_EMAIL_CHANGED:
            return {...state, email: action.payload};
        case MASTER_REGISTER_PHONE_CHANGED:
            return {...state, phone: action.payload};
        case MASTER_REGISTER_PASSWORD_CHANGED:
            return {...state, password: action.payload};
        case MASTER_REGISTER:
            return {...state, spinnerStatus: false};
        case MASTER_CREATE:
            return {...state, spinnerStatus: true};
        case MASTER_CREATE_FAILED:
            return {...state, spinnerStatus: false};
        default:
            return state;
    }
}