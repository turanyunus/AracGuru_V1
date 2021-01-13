import {Platform} from 'react-native';

function apiUrlCommons() {
    let getApiUrlCommon = null;
    if (Platform.OS === 'ios'){
        return '';
    }

    if (Platform.Version >= 25) {
        getApiUrlCommon = '';
    } else {
        getApiUrlCommon = '';
    }
    return getApiUrlCommon;
}
export const apiUrlCommon = apiUrlCommons();
