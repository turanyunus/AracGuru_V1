import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image, Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import {LoginComponent, Background, ForgotPassModal } from '../components';
import { Actions } from 'react-native-router-flux';

export default class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            emailValid:true,
            passwordValid:true,
            driver: '',
            showForgotModal:false,
            emailerror:null
        }

    }


    closeModal(){ 
        this.setState({ showForgotModal: false })
    }

    //go to register page
    onPressRegister() {
        Actions.RegistrationPage()
    }

    //forgot password press
    forgotPassPress() {
        this.setState({showForgotModal:true})
    }
    
    onPressForgotPass(email) {
        this.setState({showForgotModal:false},()=>{
            setTimeout(() => {
                alert('We have sent a password reset email to your email id')        
            }, 600);
        });
    }

    renderforIOS(){
        if(Platform.OS==='ios')
            return (
                <KeyboardAvoidingView style={{flex:1}} behavior={"padding"}>
                    <View style={styles.containerView}>
                        <LoginComponent
                            complexity={'complex'}
                            onPressRegister={()=>{this.onPressRegister()}}
                            onPressForgotPassword={()=>{this.forgotPassPress()}}
                        />
                    </View>

                    <ForgotPassModal
                        modalvisable={this.state.showForgotModal}
                        requestmodalclose={()=>{this.closeModal()}}
                        inputEmail={this.props.email}
                        emailerrorMsg={this.state.emailerror}
                        onChangeTextInput={(value)=>{this.setState({emailerror:null,email:value})}}
                        onPressForgotPass={(email)=>this.onPressForgotPass(email)}
                    />
                </KeyboardAvoidingView>
            );
        else
            return (
                <View style={{flex:1, top: 60}}>
                    <View style={styles.containerView}>
                        <LoginComponent
                            complexity={'complex'}
                            onPressRegister={()=>{this.onPressRegister()}}
                            onPressForgotPassword={()=>{this.forgotPassPress()}}
                        />
                    </View>
                    <ForgotPassModal
                        modalvisable={this.state.showForgotModal}
                        requestmodalclose={()=>{this.closeModal()}}
                        inputEmail={this.props.email}
                        emailerrorMsg={this.state.emailerror}
                        onChangeTextInput={(value)=>{this.setState({emailerror:null,email:value})}}
                        onPressForgotPass={(email)=>this.onPressForgotPass(email)}
                    />
                </View>
            );
    }

  render() {
    return (
        <Background>
            <View style={styles.logo}>
                <Image style={{width: 110, height: 90}} source={Platform.OS==='ios'?require('../../assets/images/logo-100.png'):require('../../assets/images/logo-100.png')}/>
            </View>
            {this.renderforIOS()}
        </Background>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView:
        {flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            top: 50
        },
    logo:{
        flex:1,
        position:'absolute',
        top:80,
        width:'100%',
        justifyContent:"flex-end",
        alignItems:'center'      
    }
});