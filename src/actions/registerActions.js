import {apiUrlCommon} from "../apiUrlCommon";


export const NAME_CHANGED = 'name_changed';
export const SURNAME_CHANGED = 'surname_changed';
export const REGISTER_EMAIL_CHANGED = 'register_email_changed';
export const REGISTER_PHONE_CHANGED = 'register_phone_changed';
export const REGISTER_PASSWORD_CHANGED = 'register_password_changed';
export const CUSTOMER_CREATE = 'customer_create';
export const REGISTER = 'customerCreate';
export const CUSTOMER_CREATE_FAILED = 'customer_create_failed';
import {Alert} from 'react-native';
import {Actions} from "react-native-router-flux";
import {
    GeneralFailedMessage,
    MasterRegisterSuccessMessage,
    UserRegisterSuccessMessage
} from "../common/ExceptionMessage";

export const nameChanged = (text) => {
    return {
        type: NAME_CHANGED,
        payload: text
    }
};

export const surnameChanged = (surname) => {
    return {
        type: SURNAME_CHANGED,
        payload: surname
    }
};

export const registerEmailChanged = (registerEmail) => {
    return {
        type: REGISTER_EMAIL_CHANGED,
        payload: registerEmail
    }
};

export const registerPhoneChanged = (registerPhone) => {
    return {
        type: REGISTER_PHONE_CHANGED,
        payload: registerPhone
    }
}

export const registerPasswordChanged = (registerPassword) => {
    return {
        type: REGISTER_PASSWORD_CHANGED,
        payload: registerPassword
    }
}

export const customerCreate = (name, surname, email, phone, password) => {
    return (dispatch) => {
        dispatch({
            type: CUSTOMER_CREATE
        });

        fetch(apiUrlCommon + "customer_user",{
            method:'POST' ,
            headers :{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                customer_Name           : name,
                customer_Surname        : surname,
                customer_E_Mail         : email,
                customer_Mobile_Number  : phone,
                customer_Password       : password
            })
        }).then((res)=>res.json()) // gelen datayı parse ediyoruz
            .then((res) => {

                if(res.error != null)
                    {
                        dispatch({
                            type: CUSTOMER_CREATE_FAILED
                        });
                        Alert.alert(res.error.message);}
                else{
                        dispatch({
                            type: REGISTER
                        });
                        Alert.alert(
                            UserRegisterSuccessMessage,
                            '',
                            [{ text: 'Tamam'}
                            ],
                        );
                        Actions.EnterScreen({type: 'reset'});
                    }
            })
            .catch((err) => {
                dispatch({
                    type: CUSTOMER_CREATE_FAILED
                });
                Alert.alert(GeneralFailedMessage);
            });

    }
};
