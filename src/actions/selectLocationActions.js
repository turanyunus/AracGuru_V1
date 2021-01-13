import {Actions} from "react-native-router-flux";



export const PROVINCE_CHANGED = 'province_changed';
export const DISTRICT_CHANGED = 'district_changed';
export const SERVICE_TYPE_CHANGED = 'service_type_changed';
export const CONTINUE_CLICKED = 'continue_clicked';
export const MASTER_LIST_CLICKED = 'master_list_clicked';

export let locationStatus;

export const provinceChanged = (text) => {
    return {
        type: PROVINCE_CHANGED,
        payload: text
    }
};

export const districtChanged = (text) => {
    return {
        type: DISTRICT_CHANGED,
        payload: text
    }
};

export const serviceTypeChanged = (text) => {
    return {
        type: SERVICE_TYPE_CHANGED,
        payload: text
    }
};

export const continueNextPage = () => {
    return (dispatch,getState) => {
        const state = getState().selectLocation;
        locationStatus = state;
        Actions.SelectServiceType();
                dispatch({
                    type: CONTINUE_CLICKED
                })
    }
};

export const masterNextPage = () => {
    return (dispatch,getState) => {
        const state = getState().selectLocation;
        locationStatus = state;
        Actions.AutoServiceList();
        dispatch({
            type: MASTER_LIST_CLICKED
        })
    }
};