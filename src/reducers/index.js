import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import RegisterReducer from './registerReducer';
import MasterRegisterReducer from './masterRegisterReducer';
import selectLocationReducer from './selectLocationReducer';
import AutoServiceReducer from './autoServiceReducer';
import ProfileReducer from './profileReducer';
import ChangePasswordReducer from './changePasswordReducer';


const appReducer =combineReducers({
    auth: AuthReducer,
    userRegister: RegisterReducer,
    masterRegister: MasterRegisterReducer,
    selectLocation: selectLocationReducer,
    serviceList: AutoServiceReducer,
    profileInfo: ProfileReducer,
    changePass: ChangePasswordReducer
});

export const rootReducer = (state, action) => {
    if (action === 'user_logout'){
        state.auth = '';
        state.profileInfo.profileDetail.result = null;

    }
    return appReducer(state, action)
};

export default appReducer;

