import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    TouchableWithoutFeedback, Alert
} from 'react-native';
import {Icon, Header, Input} from 'react-native-elements';
import {colors, theme} from '../common/theme';
import { Actions } from 'react-native-router-flux';
import RNPickerSelect from "react-native-picker-select";
import {fetchCustomerProfile} from "../actions";
import {connect} from 'react-redux';
import {apiUrlCommon} from "../apiUrlCommon";
import {formatPhoneNumber, GetAsyncStorageCommon, tokenDecode} from "../common/functionCommon";
import {FourCharForYearsErrorMessage, GeneralFailedMessage, UserInfoUpdateMessage} from "../common/ExceptionMessage";
import {ProfileScreenUpdateInput} from "../models/ProfileScreenUpdateInput";
import SpinnerPage from "../common/spinner";
import {rootReducer} from "../reducers";
import AsyncStorage from "@react-native-community/async-storage";
export const USER_LOGOUT = 'user_logout';

const {width, height} = Dimensions.get('window');

let markers = [];
let city, cityID;
let customerGender;

const gender = [
    {
        label: 'Erkek',
        value: 'Erkek',
    },
    {
        label: 'Kadın',
        value: 'Kadın',
    }
];

class ProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: 'Ayhan Demirci',
            loaded: false,
            customerCity: [],
            selectedCity: '',
            selectedGender: '',
            loading       : false
        };
    }

    componentDidMount(){
        this.fetchCustomerCity().then();
        const {userToken} = this.props;
        this.props.fetchCustomerProfile(userToken);
    }

    onCustomerCityChange(text){
        this.setState({selectedCity: text});
    }

    onGenderChange(text){
        this.setState({selectedGender: text});
    }

    onLogoutClicked = async () =>  {
        await AsyncStorage.removeItem('TokenAccess');
        await AsyncStorage.removeItem('onWhichScreen');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('surname');
        await AsyncStorage.removeItem('email');
        rootReducer(this.props.state, USER_LOGOUT);
        Actions.EnterScreen({type: 'reset'});
    };

    fetchCustomerCity = async () => {
        markers = [];
        try {
            const response = await fetch(apiUrlCommon + "cities");
            const json = await response.json();
            this.setState({ data: json, loading:false });

            for(let items of this.state.data) {
                markers.push({
                    label: items.city_Name,
                    value:  items.city_ID,
                });
                await this.setState({
                    customerCity: markers // add this
                });
            }
        }catch(error) {
            Alert.alert(GeneralFailedMessage);
        }

    };

    updateCustomerInfo = async (city, gender)=> {
        this.setState({loading : true});
        const token = await GetAsyncStorageCommon();
        let userID = tokenDecode(token);

        try{
            let model = new ProfileScreenUpdateInput();
            model.customer_User_ID          = userID;//CustomerOrMasterId
            model.customer_Gender = gender;
            model.customer_City_ID = city;
            model.customer_Birth_Date = null;

            fetch(apiUrlCommon + "customer_user",{
                method:'PUT' ,
                headers :{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(model)
            }).then((res)=> res.json())
                .then((res) => {
                    this.setState({loading : false});
                    Alert.alert(
                        UserInfoUpdateMessage,
                        '',
                        [{ text: 'Tamam'}
                        ],
                    );
                })
                .catch((err) => {
                    Alert.alert(GeneralFailedMessage);
                    this.setState({loading : false});
                });
        }catch (e) {
            Alert.alert(GeneralFailedMessage);
            this.setState({loading : false});
        }
    }


    render() {
        const { profileData } = this.props;
        let customerProfile = [];

        if(profileData != null)
        {
            customerProfile = profileData;
            city = profileData.cities?.city_Name;
            cityID = profileData.cities?.city_ID;
            customerGender = profileData.customer_Gender === '' ? null : profileData.customer_Gender;
            setToken(customerProfile).then();
        }

        const placeholderCity = {
            label: city == null ? 'Lütfen il seçiniz...': city,
            value: null,
            color: '#000000',
        };
        const placeholderGender = {
            label: customerGender == null ? 'Lütfen cinsiyet seçiniz...': customerGender,
            value: null,
            color: '#000000',
        };

        const {loading} = this.state;

        const registerButton = loading ? (
            <SpinnerPage />
        ):(
            <TouchableOpacity
                onPress={() => {
                    let customerCity;
                    if (this.state.selectedCity == null) {
                        customerCity = cityID;
                    }else {
                        customerCity = this.state.selectedCity
                    }
                    let cusGender;
                    if (this.state.selectedGender == null){
                        cusGender = customerGender;
                    }else {
                        cusGender = this.state.selectedGender
                    }
                    this.updateCustomerInfo(customerCity, cusGender);
                }}
                style={styles.button}>
                <Text style={styles.textStyle}>Bilgilerimi Güncelle</Text>
            </TouchableOpacity>
        );

        return (
            <View style={styles.mainView}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>
                    <Header
                        backgroundColor={colors.GREY.default}
                        leftComponent={{icon:'md-menu', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.drawerOpen()} }}
                        centerComponent={<Text style={styles.headerTitleStyle}>Profilim</Text>}
                        rightComponent={{icon:'ios-notifications', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{Actions.NotifScreen() } }}
                        outerContainerStyles={styles.headerStyle}
                        innerContainerStyles={{marginLeft:10, marginRight: 10}}
                    />
                    <View style={styles.scrollViewStyle}>
                        <Text style={styles.profStyle}>Profil Detayları</Text>
                    </View>

                    <View style={styles.viewStyle}>
                        <View style={styles.imageParentView}>
                            <View style={styles.imageViewStyle}>
                                <Image source={Platform.OS=='ios'?require('../../assets/images/profilePic.png'):require('../../assets/images/profilePic.png')} style={{borderRadius: 130/2, width: 130, height: 130}} />
                            </View>
                        </View>
                        <Text style={styles.textPropStyle}>{customerProfile.customer_Name} {customerProfile.customer_Surname}</Text>
                    </View>

                    <View style={styles.newViewStyle}>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='envelope-letter'
                                type='simple-line-icon'
                                color={colors.GREY.btnPrimary}
                                size={30}
                                containerStyle={styles.iconContainer}
                            />
                            <Input
                                editable={false}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholderTextColor={'black'}
                                value={customerProfile.customer_E_Mail}
                                keyboardType={'email-address'}
                                inputStyle={styles.inputTextStyle}
                                secureTextEntry={false}
                                blurOnSubmit={true}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='mobile-phone'
                                type='font-awesome'
                                color={colors.GREY.btnPrimary}
                                size={45}
                                containerStyle={styles.iconContainer}
                            />
                            <Input
                                editable={false}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholderTextColor={'black'}
                                value={formatPhoneNumber(customerProfile.customer_Mobile_Number)}
                                keyboardType={'number-pad'}
                                inputStyle={styles.inputTextStyle}
                                onChangeText={(text)=>{this.setState({mobile: text})}}
                                secureTextEntry={false}
                                blurOnSubmit={true}
                                onSubmitEditing={() => { this.validateMobile(); this.passwordInput.focus()}}
                                errorStyle={styles.errorMessageStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='globe'
                                type='simple-line-icon'
                                color={colors.GREY.btnPrimary}
                                size={30}
                                containerStyle={styles.iconContainer}
                            />
                            <ScrollView>
                                {/* and iOS onUpArrow/onDownArrow toggle example */}
                                <RNPickerSelect
                                    placeholder={placeholderCity}
                                    items={markers}
                                    onValueChange={this.onCustomerCityChange.bind(this)}
                                    style={styles}
                                    value={this.state.selectedCity}
                                    useNativeAndroidPickerStyle={false}
                                    pickerProps={{ model: "dialog" }}
                                    doneText={'Bitti'}
                                />
                            </ScrollView>
                        </View>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='venus-mars'
                                type='font-awesome'
                                color={colors.GREY.btnPrimary}
                                size={30}
                                containerStyle={styles.iconContainer}
                            />
                            <ScrollView>
                                {/* and iOS onUpArrow/onDownArrow toggle example */}
                                <RNPickerSelect
                                    placeholder={placeholderGender}
                                    items={gender}
                                    onValueChange={this.onGenderChange.bind(this)}
                                    style={styles}
                                    value={this.state.selectedGender}
                                    useNativeAndroidPickerStyle={false}
                                    doneText={'Bitti'}
                                />
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.flexView3}>
                        {registerButton}
                        <TouchableOpacity onPress={()=>{Actions.GetMyCarsScreen();}}
                                          style={styles.textIconStyle}>
                            <Text style={styles.emailStyle}>Araçlarım</Text>
                            <Icon
                                name='ios-arrow-forward'
                                type='ionicon'
                                color={colors.GREY.iconPrimary}
                                size={35}
                                containerStyle={{ right: 20 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{Actions.ChangePasswordScreen()}}
                                          style={styles.textIconStyle2}>
                            <Text style={styles.emailStyle}>Şifre Değiştir</Text>
                            <Icon
                                name='ios-arrow-forward'
                                type='ionicon'
                                color={colors.GREY.iconPrimary}
                                size={35}
                                containerStyle={{ right: 20 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            //Actions.EnterScreen({type: 'reset'});
                            this.onLogoutClicked();
                        }} style={styles.textIconStyle2}>
                            <Text style={styles.emailStyle}>Çıkış Yap</Text>
                            <Icon
                                name='ios-arrow-forward'
                                type='ionicon'
                                color={colors.GREY.iconPrimary}
                                size={35}
                                containerStyle={{ right: 20 }}
                            />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontSize: 20
    },
    logo:{
        flex:1,
        position:'absolute',
        top:110,
        width:'100%',
        justifyContent:"flex-end",
        alignItems:'center'
    },
    footer:{
        flex:1,
        position:'absolute',
        bottom:0,
        height:150,
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems:'center'
    },
    scrollStyle:{
        flex: 1,
        height: height,
        backgroundColor:colors.WHITE
    },
    scrollViewStyle:{
        width: width,
        height: 50,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    profStyle:{
        fontSize: 18,
        left: 20,
        fontWeight:'bold',
        color:colors.GREY.btnPrimary,

    },
    viewStyle:{
        justifyContent:'center',
        alignItems:'center',
        marginTop: 13
    },
    imageParentView:{
        borderRadius: 150/2,
        width: 150,
        height: 150,
        backgroundColor: colors.GREY.secondary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageViewStyle:{
        borderRadius: 140/2,
        width: 140,
        height: 140,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPropStyle:{
        fontSize: 21,
        fontWeight:'bold',
        color: colors.GREY.iconSecondary,

        top: 8
    },
    newViewStyle:{
        flex: 1,
        marginTop: 40,
        marginRight: 15,
        marginLeft: 15
    },
    emailStyle:{
        fontSize: 17,
        left: 10,
        color: colors.GREY.btnPrimary,

    },
    emailAdressStyle:{
        fontSize: 15,
        color: colors.GREY.secondary,

    },
    mainIconView:{
        flex: 1,
        left: 20,
        marginRight: 40,
        borderBottomColor: colors.GREY.iconSecondary,
        borderBottomWidth: 1
    },
    text1:{
        fontSize: 17,
        left: 10,
        color:colors.GREY.btnPrimary,

    },
    text2:{
        fontSize: 15,
        left: 10,
        color:colors.GREY.secondary,

    },
    textIconStyle:{
        width: width,
        height: 50,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textIconStyle2:{
        width: width,
        height: 50,
        marginTop:10,
        backgroundColor: colors.GREY.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainView:{
        flex:1,
        backgroundColor: colors.WHITE
    },
    flexView1:{
        flex:1
    },
    flexView2:{
        flex:1
    },
    flexView3:{
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center'
    },
    textInputContainerStyle:{
        flexDirection:'row',
        alignItems: "center",
        marginRight:20,
        padding: 15
    },
    iconContainer: {
        paddingTop:8,
        width: 35
    },
    textInputStyle:{
        marginLeft:10,
        width: '90%',
    },
    button:{
        marginBottom: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:10,
        height:50,
        width:'70%',
        backgroundColor: colors.GREY.default
    },
    buttonDisabled: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:10,
        height:50,
        width:'70%',
        display: 'none',
        backgroundColor: colors.GREY.default,
        opacity:0.7
    },
    textStyle:{
        fontSize: 16,
        color: colors.WHITE,
        textAlign: "center",
        fontWeight: 'bold'
    },
    inputIOS: {
        fontSize: 18,
        marginLeft: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 18,
        marginLeft: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

const mapStateToProps = state => {
    const profileData  = state.profileInfo.profileDetail.result;

    return{
        profileData, state
    }
};

export default connect(mapStateToProps,
    {fetchCustomerProfile})(ProfileScreen);

const setToken = async (customerProfile) => {
    await AsyncStorage.setItem('name',customerProfile.customer_Name);
    await AsyncStorage.setItem('surname',customerProfile.customer_Surname);
    await AsyncStorage.setItem('email',customerProfile.customer_E_Mail);
};
