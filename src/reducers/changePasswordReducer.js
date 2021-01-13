import {
    OLD_PASSWORD_CHANGED,NEW_PASSWORD_CHANGED,RE_NEW_PASSWORD_CHANGED,UPDATE_PASSWORD
} from '../actions';

const INITIAL_STATE = {
    oldPassword: '',
    newPassword: '',
    reNewPassword: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OLD_PASSWORD_CHANGED:
            return {...state, oldPassword: action.payload};
        case NEW_PASSWORD_CHANGED:
            return {...state, newPassword: action.payload};
        case RE_NEW_PASSWORD_CHANGED:
            return {...state, reNewPassword: action.payload};
        case UPDATE_PASSWORD:
            return {...state};
        default:
            return state;
    }
}