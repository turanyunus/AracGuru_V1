import React, { Component } from 'react';
import {Scene, Router, Drawer, Actions} from 'react-native-router-flux';
import {
    EnterScreen, IntroScreen, LoginScreen,
    MasterLoginScreen, RegistrationPage,
    MasterRegistrationPage, SelectLocationScreen,
    SelectServiceType, AutoServiceList,
    TowTruckList, ProfileScreen, ChangePasswordScreen,
    MasterProfileScreen, MasterAutoServicesList,
    AutoServiceDetail, TowTruckDetail, NotifScreen, EmptyScreens,
    AutoServiceBranchDetail, GetMyCarsScreen, MyCarsAddedScreen, MyCarsUpdatedScreen,
    MessagesScreen, StoreScreen, ProductsScreen, AboutScreen, RegisterSelectLocationScreen
} from './screens';
import { SideMenu } from "./components";
import { BackHandler, BackAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as globalVar from "./common/globalVariable";
import { GetOnWhichScreenCommon} from "./common/functionCommon";
var backButtonPressedOnceToExit = false;

class RouterComp extends Component {
    constructor() {
        super();
    }

    componentDidMount(): void {
        this.setToken();
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    onBackPress  = async () =>  {

        const userType = await GetOnWhichScreenCommon();

        if (backButtonPressedOnceToExit) {
            BackAndroid.exitApp();
        } else {
            if ((globalVar.onWhichScreen === 'master' || userType === 'master') &&
                (Actions.currentScene !== 'MasterRegistrationPage'
                    && Actions.currentScene !== 'MasterLoginScreen'
                    && Actions.currentScene !== 'EnterScreen')){

                Actions.MasterProfileScreen();
                return true;

            }else if ((globalVar.onWhichScreen === 'driver' || userType === 'driver') &&
                (Actions.currentScene !== 'RegistrationPage'
                    && Actions.currentScene !== 'LoginScreen'
                    && Actions.currentScene !== 'EnterScreen')){
                Actions.ProfileScreen();
                return true;
            }
        }
    }

     setToken = async () => {
        const token = await AsyncStorage.getItem('TokenAccess');

        if (token !== null) {
            if (await AsyncStorage.getItem('onWhichScreen') === 'master') {
                Actions.MasterProfileScreen();
            } else if (await AsyncStorage.getItem('onWhichScreen') === 'driver') {
                Actions.ProfileScreen();
            }
        }
    };

    render() {
        return (
            <Router backAndroidHandler={this.onBackPress}>
                <Scene key="root" titleStyle={{color: 'white'}}
                       navigationBarStyle={{backgroundColor: '#05141a'}}
                       headerTintColor={'white'}
                       tintColor={'white'}
                       hideNavBar={true}>
                    <Scene key="EnterScreen"
                           component={EnterScreen}/>
                    <Scene key="SelectLocationScreen"
                           component={SelectLocationScreen}
                           title={"Acil Yardım"}
                           hideNavBar={false}/>
                    <Scene key="SelectServiceType"
                           component={SelectServiceType}
                           title={"Arıza Tipi"}
                           hideNavBar={false}/>
                    <Scene key="IntroScreen"
                           component={IntroScreen}/>
                    <Scene key="LoginScreen"
                           component={LoginScreen}
                           title={"Kullanıcı Girişi"}
                           hideNavBar={false}/>
                    <Scene key="RegistrationPage"
                           component={RegistrationPage}
                           hideNavBar={false}/>
                    <Scene key="MasterLoginScreen"
                           component={MasterLoginScreen}
                           title={"Usta Girişi"}
                           hideNavBar={false}/>
                    <Scene key="MasterRegistrationPage"
                           component={MasterRegistrationPage}
                           hideNavBar={false}/>
                    <Scene key="AutoServiceList"
                           titleStyle={{color: 'black'}}
                           navigationBarStyle={{backgroundColor: '#f8f1f1'}}
                           headerTintColor={'blue'}
                           tintColor={'blue'}
                           component={AutoServiceList}
                           title={"Arama Sonuçları"}
                           backTitle={"Geri"}
                           hideNavBar={false}/>
                    <Scene key="AutoServiceDetail"
                           titleStyle={{color: 'black'}}
                           navigationBarStyle={{backgroundColor: '#f8f1f1'}}
                           headerTintColor={'blue'}
                           tintColor={'blue'}
                           title={'Servis'}
                           component={AutoServiceDetail}
                           hideNavBar={false}/>
                    <Scene key="TowTruckList"
                           titleStyle={{color: 'black'}}
                           navigationBarStyle={{backgroundColor: '#f8f1f1'}}
                           headerTintColor={'blue'}
                           tintColor={'blue'}
                           component={TowTruckList}
                           title={"Arama Sonuçları"}
                           backTitle={"Geri"}
                           hideNavBar={false}/>
                    <Scene key="TowTruckDetail"
                           titleStyle={{color: 'black'}}
                           navigationBarStyle={{backgroundColor: '#f8f1f1'}}
                           headerTintColor={'blue'}
                           tintColor={'blue'}
                           component={TowTruckDetail}
                           title={'Servis'}
                           hideNavBar={false}/>
                    <Drawer
                        hideNavBar
                        key="drawerMenu"
                        contentComponent={SideMenu}
                        content={<SideMenu/>}>
                        <Scene key="ProfileScreen"
                               hideNavBar={true}
                               component={ProfileScreen}/>
                        <Scene key="MasterProfileScreen"
                               hideNavBar={true}
                               component={MasterProfileScreen}/>
                        <Scene key="RegisterSelectLocationScreen"
                               hideNavBar={true}
                               component={RegisterSelectLocationScreen}/>
                        <Scene key="ChangePasswordScreen"
                               hideNavBar={true}
                               component={ChangePasswordScreen}/>
                        <Scene key="MasterAutoServicesList"
                               hideNavBar={true}
                               component={MasterAutoServicesList}/>
                        <Scene key="AutoServiceBranchDetail"
                               hideNavBar={true}
                               component={AutoServiceBranchDetail}/>
                        <Scene key="EmptyScreens"
                               component={EmptyScreens}
                               hideNavBar={true}/>
                        <Scene key="NotifScreen"
                               component={NotifScreen}
                               hideNavBar={true}/>
                        <Scene key="GetMyCarsScreen"
                               component={GetMyCarsScreen}
                               hideNavBar={true}/>
                        <Scene key="MyCarsAddedScreen"
                               component={MyCarsAddedScreen}
                               hideNavBar={true}/>
                        <Scene key="MyCarsUpdatedScreen"
                               component={MyCarsUpdatedScreen}
                               hideNavBar={true}/>
                        <Scene key="MessagesScreen"
                               component={MessagesScreen}
                               hideNavBar={true}/>
                        <Scene key="StoreScreen"
                               component={StoreScreen}
                               hideNavBar={true}/>
                        <Scene key="ProductsScreen"
                               component={ProductsScreen}
                               hideNavBar={true}/>
                        <Scene key="AboutScreen"
                               component={AboutScreen}
                               hideNavBar={true}/>
                    </Drawer>
                </Scene>
            </Router>
        );
    }
}

export default RouterComp;