import {
    PROVINCE_CHANGED,
    DISTRICT_CHANGED,
    CONTINUE_CLICKED,
    SERVICE_TYPE_CHANGED,
    MASTER_LIST_CLICKED} from '../actions';

const INITIAL_STATE = {
    province: '',
    district: '',
    serviceType: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROVINCE_CHANGED:
            return {...state, province: action.payload};
        case DISTRICT_CHANGED:
            return {...state, district: action.payload};
        case CONTINUE_CLICKED:
            return {...state};
        case SERVICE_TYPE_CHANGED:
            return {...state, serviceType: action.payload};
        case MASTER_LIST_CLICKED:
            return {...state};
        default:
            return state;
    }
}
