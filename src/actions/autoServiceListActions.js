import {apiUrlCommon} from "../apiUrlCommon";
import {Alert} from "react-native";
import {GeneralFailedMessage} from "../common/ExceptionMessage";

export const FETCH_AUTO_SERVICE = 'fetch_auto_service';
export const FETCH_TOW_TRUCK = 'fetch_tow_truck';

let json = [];

export const fetchAutoService = (province, district, serviceType) => {
    return async (dispatch) => {
    if(district ==='' || district == null){
        district = 0;
    }
    if (serviceType === '' || serviceType == null){
        serviceType = 0;
    }
        try {
            let response = await fetch(apiUrlCommon + "auto_service/searchAutoService/"+province+"/"+district+"/"+serviceType);
            json = await response.json();
            
            dispatch({
                type: FETCH_AUTO_SERVICE,
                payload: json
            })
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }

    }
};

export const fetchTowTruck = (province, district) => {
    return async (dispatch) => {
        if(district ==='' || district == null){
            district = 0;
        }
        try {
            let response = await fetch(apiUrlCommon + "auto_service/GetMovedServiceList/"+province+"/"+district+"/"+0);
            json = await response.json();
            dispatch({
                type: FETCH_TOW_TRUCK,
                payload: json
            })
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }

    }
};


