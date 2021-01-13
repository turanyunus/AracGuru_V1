import {apiUrlCommon} from "../apiUrlCommon";


export const MASTER_NAME_CHANGED = 'master_name_changed';
export const MASTER_SURNAME_CHANGED = 'master_surname_changed';
export const MASTER_REGISTER_EMAIL_CHANGED = 'master_register_email_changed';
export const MASTER_REGISTER_PHONE_CHANGED = 'master_register_phone_changed';
export const MASTER_REGISTER_PASSWORD_CHANGED = 'master_register_password_changed';
export const MASTER_CREATE = 'master_create';
export const MASTER_REGISTER = 'masterCreate';
export const MASTER_CREATE_FAILED = 'master_create_failed';
import {Alert} from 'react-native';
import {Actions} from "react-native-router-flux";
import {
    GeneralFailedMessage,
    MasterRegisterSuccessMessage, UserLoginWrongInfo,
    UserRegisterSuccessMessage
} from "../common/ExceptionMessage";

export const masterNameChanged = (text) => {
    return {
        type: MASTER_NAME_CHANGED,
        payload: text
    }
};

export const masterSurnameChanged = (surname) => {
    return {
        type: MASTER_SURNAME_CHANGED,
        payload: surname
    }
};

export const masterRegisterEmailChanged = (registerEmail) => {
    return {
        type: MASTER_REGISTER_EMAIL_CHANGED,
        payload: registerEmail
    }
};

export const masterRegisterPhoneChanged = (registerPhone) => {
    return {
        type: MASTER_REGISTER_PHONE_CHANGED,
        payload: registerPhone
    }
};

export const masterRegisterPasswordChanged = (registerPassword) => {
    return {
        type: MASTER_REGISTER_PASSWORD_CHANGED,
        payload: registerPassword
    }
};

export const masterCreate = (name, surname, email, phone, password) => {
    return (dispatch) => {
        dispatch({
            type: MASTER_CREATE
        });

        fetch(apiUrlCommon + "auto_service_master",{
            method:'POST' ,
            headers :{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                master_Name             : name,
                master_Surname          : surname,
                master_Email            : email,
                master_Phone            : phone,
                master_Password         : password
            })
        }).then((res)=>res.json()) // gelen datayı parse ediyoruz
            .then((res) => {

                if(res.error != null)
                {
                    dispatch({
                        type: MASTER_CREATE_FAILED
                    });
                    Alert.alert(res.error.message);}
                else{
                    dispatch({
                        type: MASTER_REGISTER
                    });
                    Alert.alert(
                        MasterRegisterSuccessMessage,
                        '',
                        [{ text: 'Tamam'}
                        ],
                    );
                    Actions.EnterScreen({type: 'reset'});
                }
            })
            .catch((err) => {
                dispatch({
                    type: MASTER_CREATE_FAILED
                });
                Alert.alert(GeneralFailedMessage);
            });

    }
};
