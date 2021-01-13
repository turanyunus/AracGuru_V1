import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';
import SideMenuHeader from './SideMenuHeader';
import { colors } from '../common/theme';
import {Actions} from "react-native-router-flux";
import {onWhichScreen} from "../common/globalVariable";
const {height} = Dimensions.get('window');
import {connect} from 'react-redux';
import {rootReducer} from "../reducers";
import {GetOnWhichScreenCommon} from "../common/functionCommon";
export const USER_LOGOUT = 'user_logout';

let userType;

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            heightIphoneSix : false,
            sideMenuListMaster: [
                {key: 1, name: 'Profilim', navigationName: 'MasterProfileScreen', icon: 'home', type: 'font-awesome', child: 'firstChild'},
                {key: 2, name: 'Şubelerim', navigationName: 'Branch',icon: 'briefcase', type: 'font-awesome', child: 'secondChild'  },
                {key: 3, name: 'Acil Yardım', navigationName: 'SelectLocationScreen', icon: 'life-ring', type: 'font-awesome', child: 'thirdChild'},
                {key: 4, name: 'Mağazam', navigationName: 'Store', icon: 'dropbox', type: 'font-awesome', child: 'fourthChild' },
                {key: 5, name: 'Mesajlar', navigationName: 'Messages', icon: 'envelope', type: 'font-awesome', child: 'fifthChild'},
                {key: 6, name: 'Bildirimler', navigationName: 'NotifScreen', icon: 'bell', type: 'material-community', child: 'sixthChild'},
                {key: 7, name: 'Hakkımızda', navigationName: 'About', icon: 'info', type: 'entypo', child: 'ninethChild'},
                {key: 8, name: 'Çıkış Yap', navigationName: 'Signout', icon: 'sign-out', type: 'font-awesome', child: 'lastChild'}
            ],
            sideMenuListDriver: [
                {key: 1, name: 'Profilim', navigationName: 'ProfileScreen', icon: 'home', type: 'font-awesome', child: 'firstChild'},
                {key: 2, name: 'Araçlarım', navigationName: 'MyCar', icon: 'car-sports', type: 'material-community', child: 'secondChild'},
                {key: 3, name: 'Acil Yardım', navigationName: 'SelectLocationScreen', icon: 'life-ring', type: 'font-awesome', child: 'thirdChild' },
                {key: 4, name: 'Mesajlar', navigationName: 'Messages', icon: 'envelope', type: 'font-awesome', child: 'fourthChild'},
                {key: 5, name: 'Bildirimler', navigationName: 'NotifScreen', icon: 'bell', type: 'material-community', child: 'fifthChild'},
                {key: 6, name: 'Ürünler', navigationName: 'Products', icon: 'shopping-cart', type: 'font-awesome', child: 'sixthChild'},
                {key: 7, name: 'Hakkımızda', navigationName: 'About', icon: 'info', type: 'entypo', child: 'ninethChild'},
                {key: 8, name: 'Çıkış Yap', navigationName: 'Signout', icon: 'sign-out', type: 'font-awesome', child: 'lastChild'}
            ],
            driver: ''
        }

    }
    
    componentDidMount(){
        this.heightReponsive();
        this.setToken().then();
    }

    setToken = async () => {
        userType = await GetOnWhichScreenCommon();
    };

    onLogoutClicked = async () => {
        await AsyncStorage.removeItem('TokenAccess');
        await AsyncStorage.removeItem('onWhichScreen');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('surname');
        await AsyncStorage.removeItem('email');
        rootReducer(this.props.state, USER_LOGOUT);
        Actions.EnterScreen({type: 'reset'});
    };

    //check for device height(specially iPhone 6)
    heightReponsive(){
        if(height <= 667){
            this.setState({heightIphoneSix :true})
        }
    }

    //navigation to screens from side menu
    navigateToScreen = (route) => () => {
        if (route === 'ProfileScreen') {
            Actions.ProfileScreen();
        }else if (route === 'MasterProfileScreen'){
            Actions.MasterProfileScreen();
        } else if (route === 'SelectLocationScreen') {
            Actions.RegisterSelectLocationScreen();
        }else if (route === 'NotifScreen'){
            Actions.NotifScreen();
        }else if (route === 'Signout'){
            this.onLogoutClicked();
        }else if (route === 'MyCar'){
            Actions.GetMyCarsScreen();
        }else if (route === 'Messages'){
            Actions.MessagesScreen();
        }else if (route === 'Products'){
            Actions.ProductsScreen();
        }else if (route === 'About'){
            Actions.AboutScreen();
        }else if (route === 'Store'){
            Actions.StoreScreen();
        }else if (route === 'Branch'){
            Actions.MasterAutoServicesList();
        }
        else{
            Actions.EmptyScreens();
        }
    };

    signOut() {

    }

    render(){
        return(
            <View style={styles.mainViewStyle}>
                <SideMenuHeader headerStyle={styles.myHeader}/>
                <View style={styles.compViewStyle}>
                    <View style={[styles.vertialLine, {height: (this.state.heightIphoneSix === false && height <= 895 && height >= 668) ? '88%' : height / 2}]}/>
                    <FlatList
                        data={ userType === "master" ? this.state.sideMenuListMaster : this.state.sideMenuListDriver}
                        keyExtractor={(item,index) => index.toString()}   
                        style={{ marginTop: 20}}   
                        bounces = {false}
                        renderItem={({item,index}) =>{
                                return( <TouchableOpacity
                                    onPress={
                                            (index == 9) ? () => this.signOut() :
                                            this.navigateToScreen(item.navigationName)
                                    }
                                    style={styles.menuItemView}>
                                    <View style={styles.viewIcon}>
                                        <Icon
                                            name={item.icon}
                                            type={item.type}
                                            color={colors.WHITE}
                                            size={16}
                                            containerStyle={styles.iconStyle}
                                        />
                                    </View>
                                    <Text style={styles.menuName}>{item.name}</Text>
                                </TouchableOpacity>)
                        }}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    myHeader:{
        marginTop:0,   
    },
    vertialLine: {
        width: 1,
        backgroundColor: colors.GREY.btnPrimary,
        position: 'absolute',
        left: 22,
        top: 24
    },
    menuItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 18,
        flex: 1,
        paddingLeft: 10, 
        paddingRight: 10,
    },
    viewIcon: {
        width: 24,
        height: 24,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.btnPrimary,
        left: 1
    },
    menuName: {
        color: colors.WHITE, 
        fontWeight: 'bold',
        marginLeft: 8,
        width:"100%"
    },
    mainViewStyle:{
        backgroundColor: colors.BLUE.dark, 
        height: '100%'
    },
    compViewStyle:{
        position: 'relative', 
        flex: 3
    },
    iconStyle:{ 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
});

const mapStateToProps = state => {
    return{
        state
    }
};

export default connect(mapStateToProps, {})(SideMenu);