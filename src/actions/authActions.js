import {apiUrlCommon} from "../apiUrlCommon";
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Actions} from "react-native-router-flux";
import * as globalVar from "../common/globalVariable";
import {
    MasterRegisterNotSuccessMessage,
    UserLoginUnSuccessMessage,
    UserLoginWrongInfo
} from "../common/ExceptionMessage";
export const EMAIL_CHANGED = 'email_changed';
export const PASSWORD_CHANGED = 'password_changed';
export const LOGIN = 'login';
export const LOGIN_USER_SUCCESS = 'login_user_success';
export const LOGIN_USER_FAILED = 'login_user_failed';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    }
};

export const passwordChanged = (password) => {
    return {
        type: PASSWORD_CHANGED,
        payload: password
    }
};

export let durum;

export const loginUser = (email, password) => {
    return (dispatch, getState) => {

        var whichUrl ='';
        if (globalVar.onWhichScreen === 'driver') {
            whichUrl = 'customer_user'
        }else if (globalVar.onWhichScreen === 'master'){
            whichUrl = 'auto_service_master'
        }

        dispatch({
            type: LOGIN
        });

        fetch(apiUrlCommon + whichUrl +"/login",{// login işlemleri başlıyor
            method:'POST' ,
            headers :{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ // servise gönderdiğimiz inputlar
                email             : email,
                phone             : email,
                password          : password
            })
        }).then((res)=>res.json()) // gelen datayı parse ediyoruz
            .then((res) => {
                if(res.error)
                    Alert.alert(UserLoginUnSuccessMessage);
                else
                {
                    loginSuccess(dispatch, res);
                    if (res.tokenString === "1001" && globalVar.onWhichScreen === 'master'){ // 1001 --> master'ın onaylanmama durumu
                        Alert.alert(
                            MasterRegisterNotSuccessMessage,
                            '',
                            [{ text: 'Tamam'}
                            ],
                        );

                        return;
                    }
                    setToken(res.tokenString).then();
                    if (globalVar.onWhichScreen === 'driver') {
                        Actions.ProfileScreen();
                    }else if (globalVar.onWhichScreen === 'master'){
                        Actions.MasterProfileScreen();
                    }

                }
            })
            .catch((ex) => {
                loginUserFailed(dispatch);
                Alert.alert(
                    UserLoginWrongInfo,
                    '',
                    [{ text: 'Tamam'}
                    ],
                );
            });

    }
};


const setToken = async (token) => {
    await AsyncStorage.setItem('TokenAccess',token);
};

const loginSuccess = (dispatch, res) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: res
    })
};

const loginUserFailed = (dispatch) => {
    dispatch({
        type: LOGIN_USER_FAILED
    })
};
