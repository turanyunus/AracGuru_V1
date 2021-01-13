import {apiUrlCommon} from "../apiUrlCommon";
import {GetAsyncStorageCommon, tokenDecode} from "../common/functionCommon";
import {Alert} from "react-native";
import {GeneralFailedMessage} from "../common/ExceptionMessage";
export const FETCH_MASTER_PROFILE = 'fetch_master_profile';
export const FETCH_CUSTOMER_PROFILE = 'fetch_customer_profile';

let json = [];
let userID ='';
export const fetchMasterProfile = (userToken) => {
    return async (dispatch) => {
        const token = await GetAsyncStorageCommon();

        if (token != null){
            userID = tokenDecode(token);
        }else{
            userID = tokenDecode(userToken);
        }


        let autoServiceID;
        try {
            let response = await fetch(apiUrlCommon + "auto_service_master/"+userID);
            json = await response.json();
            autoServiceID = json.autoservice_ID;
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }

        try {
            let response = await fetch(apiUrlCommon + "auto_service/GetAutoServiceAndMaster/"+autoServiceID);
            json = await response.json();
            dispatch({
                type: FETCH_MASTER_PROFILE,
                payload: json
            })
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }

    }
};

export const fetchCustomerProfile = (userToken) => {
    return async (dispatch) => {

        const token = await GetAsyncStorageCommon();

        if (token != null){
            userID = tokenDecode(token);
        }else{
            userID = tokenDecode(userToken);
        }
        try {
            let response = await fetch(apiUrlCommon + "customer_user/allinfo/"+userID);
            json = await response.json();
            dispatch({
                type:FETCH_CUSTOMER_PROFILE,
                payload: json
            })
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }
    }
};