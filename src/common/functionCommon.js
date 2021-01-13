import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-community/async-storage';

export function formatPhoneNumber  (maskedNumber) {
    //Filter only numbers from the input
    let cleaned = ('' + maskedNumber).replace(/\D/g, '');

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{4})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + ' ' + match[3] +' ' + match[4]
    }
    return null
};

export function tokenDecode (tokenString) {
    let token  = 'Bearer ' + tokenString;
    const decodedToken = jwt_decode(token);
    return decodedToken.nameid;

};

export const  GetAsyncStorageCommon = async () => {
    const token = await AsyncStorage.getItem('TokenAccess');
    return token;
};


export const  GetOnWhichScreenCommon = async () => {
    const whichScreen = await AsyncStorage.getItem('onWhichScreen');
    return whichScreen;
};