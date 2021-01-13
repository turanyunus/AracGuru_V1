import {apiUrlCommon} from "../apiUrlCommon";
import {Alert} from 'react-native';
import {ChangePasswordInput} from '../models/ChangePasswordInput';
import {GeneralFailedMessage} from "../common/ExceptionMessage";
import * as globalVar from "../common/globalVariable";
import {GetAsyncStorageCommon, GetOnWhichScreenCommon, tokenDecode} from "../common/functionCommon";
import {Actions} from "react-native-router-flux";

export const OLD_PASSWORD_CHANGED = 'old_password_changed';
export const NEW_PASSWORD_CHANGED = 'new_password_changed';
export const RE_NEW_PASSWORD_CHANGED = 're_new_password_changed';
export const UPDATE_PASSWORD = 'update_password';

let customerURLGet = 'customer_user/ChangePassword';
let masterURLGet = 'auto_service_master/ChangePassword';

export const oldPasswordChanged = (text) => {
    return {
        type: OLD_PASSWORD_CHANGED,
        payload: text
    }
};

export const newPasswordChanged = (text) => {
    return {
        type: NEW_PASSWORD_CHANGED,
        payload: text
    }
};

export const reNewPasswordChanged = (text) => {
    return {
        type: RE_NEW_PASSWORD_CHANGED,
        payload: text
    }
};

export const updatePassword = (oldPassword, newPassword) => {
    return async (dispatch) =>{
        dispatch({
            type:UPDATE_PASSWORD
        });

        const token = await GetAsyncStorageCommon();
        let userID = tokenDecode(token);
        let userType = await GetOnWhichScreenCommon();
        try{
            let model = new ChangePasswordInput();
            model.Id          = userID; //CustomerOrMasterId
            model.OldPassword = oldPassword;
            model.NewPassword = newPassword;

            let getChangePass = '';
            if (globalVar.onWhichScreen === 'master' || userType === 'master'){
                getChangePass = masterURLGet
            }else{
                getChangePass = customerURLGet
            }
            fetch(apiUrlCommon + getChangePass,{
                method:'PUT' ,
                headers :{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(model)
            }).then((res)=> res.json())
                .then((res) => {
                    if (res.error != null)
                        Alert.alert(res.error.message);
                    else{
                        if(globalVar.onWhichScreen === 'master' || userType === 'master'){
                            Actions.MasterProfileScreen();
                            Alert.alert('Şifreniz başarıyla güncellendi.',
                                '',
                                [{ text: 'Tamam'}
                                ],);
                        }else{
                            Actions.ProfileScreen();
                            Alert.alert('Şifreniz başarıyla güncellendi.',
                                '',
                                [{ text: 'Tamam'}
                                ],);
                        }
                    }
                })
                .catch((err) => {
                    Alert.alert(GeneralFailedMessage);
                });
        }catch (e) {
            Alert.alert(GeneralFailedMessage);
        }
    }
};