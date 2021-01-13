import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity, Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Background, Button } from '../components';
import commonStyles from '../common/styles';
import { Actions } from 'react-native-router-flux';
import {colors, theme} from "../common/theme";
import * as globalVar from "../common/globalVariable";

export default class EnterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false }
    }

    //on press "Enter As Rider"
     onRiderPress =  async () => {
        await AsyncStorage.setItem('onWhichScreen','master');
        globalVar.onWhichScreen = 'master';
        Actions.MasterLoginScreen()
    };

    //on press "Enter As Driver"
    onDriverPress = async () => {
        await AsyncStorage.setItem('onWhichScreen','driver');
        globalVar.onWhichScreen = 'driver';
        Actions.LoginScreen()
    };

    NextPage =  async () => {
        await AsyncStorage.removeItem('onWhichScreen');
        Actions.SelectLocationScreen();
    };

    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
    };

    render() {
        return (
            <Background>
                <View style={styles.logo}>
                    <Image style={{width: 160, height: 120}} source={Platform.OS==='ios'?require('../../assets/images/enterScreeenLogo.png'):require('../../assets/images/enterScreeenLogo.png')}
                           onLoad={this._onLoad}/>
                    {!this.state.loaded &&
                    <Image style={{width: 160, height: 120}} source={Platform.OS==='ios'?require('../../assets/images/enterScreeenLogo.png'):require('../../assets/images/enterScreeenLogo.png')}/>
                    }
                </View>

                <View style={styles.helpButtonStyle}>
                    <TouchableOpacity
                        onPress={()=>{this.NextPage()}}
                        style={styles.button}>
                        <Text style={styles.textStyle}>Acil Yardım</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Button
                        style={commonStyles.buttonBlue}
                        textStyle={commonStyles.buttonText}
                        btnClick={()=>{this.onDriverPress()}}
                    >Kullanıcı Girişi</Button>
                    <Button
                        style={commonStyles.buttonYellow}
                        textStyle={commonStyles.buttonText}
                        btnClick={()=>{this.onRiderPress()}}
                    >Usta Girişi</Button>
                </View>
            </Background>
        );
    }
}

const styles = StyleSheet.create({
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
        bottom:35,
        height:75,
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems:'center'

    },
    helpButtonStyle:{
        position:'absolute',
        bottom:65,
        marginBottom: 50,
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems:'center',
    },
    button:{
        alignItems: 'center',
        justifyContent:'center',
        borderRadius:5,
        height:50,
        width:'96%',
        backgroundColor:theme.BUTTON_RED
    },
    textStyle:{
        fontSize: 17,
        color: colors.WHITE,
        textAlign: "center"
    }
});