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
    StatusBar,
    TouchableWithoutFeedback
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { colors } from '../common/theme';
import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {fetchMasterProfile} from "../actions";
import {formatPhoneNumber} from "../common/functionCommon"
import {rootReducer} from "../reducers";
import AsyncStorage from "@react-native-community/async-storage";
export const USER_LOGOUT = 'user_logout';

const {width, height} = Dimensions.get('window');

export let services = '';

class MasterProfileScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: 'Turan Yunus',
        }
    }

    //sign out and clear all async storage
    signOut() {

    }

    onLogoutClicked = async () => {
        await AsyncStorage.removeItem('TokenAccess');
        await AsyncStorage.removeItem('onWhichScreen');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('surname');
        await AsyncStorage.removeItem('email');
        rootReducer(this.props.state, USER_LOGOUT);
        Actions.EnterScreen({type: 'reset'});
    };

    componentDidMount(){
        const {userToken} = this.props;
        this.props.fetchMasterProfile(userToken);
    }

    render() {
        const { profileData } = this.props;
        let profileDetail = [];
        let masterDetail = [];
        let city, district;

        if(profileData != null)
        {
            profileDetail = profileData;
            services = profileDetail.autoservice_ID;
            masterDetail = profileData.auto_Service_Masters[0];
            city = profileData.cities.city_Name;
            district = profileData.districts.district_Name;
            setToken(masterDetail).then();
        }
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
                                <Image source={Platform.OS=='ios'?require('../../assets/images/mastericon.png'):require('../../assets/images/mastericon.png')} style={{borderRadius: 130/2, width: 130, height: 130}} />
                            </View>
                        </View>
                        <Text style={styles.textPropStyle}>{masterDetail.master_Name } {masterDetail.master_Surname}</Text>
                        <Text style={styles.textServiceName}
                              numberOfLines={2}>{profileDetail.autoservice_Name}</Text>
                    </View>

                    <View style={styles.newViewStyle}>
                        <View style={styles.myViewStyle}>
                            <View style={styles.iconViewStyle}>
                                <Icon
                                    name='envelope-letter'
                                    type='simple-line-icon'
                                    color={colors.GREY.btnPrimary}
                                    size={30}
                                />
                                <Text style={styles.emailStyle}>Email</Text>
                            </View>
                            <View style={styles.flexView1}>
                                <Text style={styles.emailAdressStyle}>{masterDetail.master_Email}</Text>
                            </View>
                        </View>
                        <View style={styles.myViewStyle}>
                            <View style={styles.iconViewStyle}>
                                <Icon
                                    name='phone-call'
                                    type='feather'
                                    color={colors.GREY.btnPrimary}
                                />
                                <Text style={styles.text1}>Telefon Numarası</Text>
                            </View>
                            <View style={styles.flexView2}>
                                <Text style={styles.text2}>{formatPhoneNumber(masterDetail.master_Phone)}</Text>
                            </View>
                        </View>
                        <View style={styles.myViewStyle}>
                            <View style={styles.iconViewStyle}>
                                <Icon
                                    name='globe'
                                    type='simple-line-icon'
                                    color={colors.GREY.btnPrimary}
                                />
                                <Text style={styles.text1}>Konum</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.text2}>{city} / {district}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.flexView3}>
                        <TouchableOpacity style={styles.textIconStyle}
                                          onPress={()=> {
                                              Actions.MasterAutoServicesList()
                                          }}>
                            <Text style={styles.emailStyle}>Şubelerim</Text>
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
    textServiceName: {
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 22,
        fontWeight:'bold',
        color: colors.GREY.iconSecondary,
        top: 25
    },
    newViewStyle:{
        flex: 1,
        height: 300,
        marginTop: 40
    },
    myViewStyle:{
        flex: 1,
        left: 20,
        marginRight: 40,
        borderBottomColor: colors.GREY.btnSecondary,
        borderBottomWidth: 1
    },
    iconViewStyle:{
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
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
        marginTop: 54
    }
});

const mapStateToProps = state => {
    const profileData  = state.profileInfo.profileDetail.result;
    const userToken = state.auth.res.tokenString;
    return{
        profileData, userToken, state
    }
};

export default connect(mapStateToProps,
    { fetchMasterProfile })(MasterProfileScreen);

const setToken = async (masterDetail) => {
    await AsyncStorage.setItem('name',masterDetail.master_Name);
    await AsyncStorage.setItem('surname',masterDetail.master_Surname);
    await AsyncStorage.setItem('email',masterDetail.master_Email);
};