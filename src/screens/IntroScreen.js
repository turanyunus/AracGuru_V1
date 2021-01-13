import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image, AsyncStorage, Platform
} from 'react-native';
import { Background, Button } from '../components';
import commonStyles from '../common/styles';

export default class IntroScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      driver: ''
    }
    //this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
 // _bootstrapAsync = async () => {
    //const driver = await AsyncStorage.getItem('driver');
    //this.setState({driver})
 // };

  //register button press and check whether driver or user
 // _onRegisterPressButton = async () => {
   // this.props.navigation.push(this.state.driver=='true' ? 'DriverReg' : 'Reg');
  //}

  //go to login page
  // _onLoginPressButton = async () => {
  //  this.props.navigation.push('Login');

  // }
  
  render() {  
    return (
      <Background>
        <View style={styles.logo}>
          <Image source={Platform.OS=='ios'?require('../../assets/images/logo-buyuk.png'):require('../../assets/images/logo-buyuk.png')}/>
        </View>
        <View style={styles.footer}>
          <Button 
            style={commonStyles.buttonBlue} 
            textStyle={commonStyles.buttonText} 
            btnClick={()=>{this._onLoginPressButton()}}
          >Kullanıcı Girişi</Button>
          <Button 
            style={commonStyles.buttonYellow}  
            textStyle={commonStyles.buttonText}
            btnClick={()=>{this._onRegisterPressButton()}}
          >Kullanıcı Kayıt</Button>
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
      bottom:0,
      height:150,
      width:'100%',
      flexDirection:'row',
      justifyContent: 'space-around',
      alignItems:'center'
    },
});