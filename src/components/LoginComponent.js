import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, LayoutAnimation, Platform } from 'react-native';
import { Input, Button } from 'react-native-elements';
import {  colors } from '../common/theme';
import { emailChanged, passwordChanged, loginUser } from '../actions';
import { connect } from 'react-redux';
import SpinnerPage from "../common/spinner";
const {width} = Dimensions.get('window');

class LoginComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            emailValid: true,
            passwordValid: false,
            pwdErrorMsg: '',
            emailErrorMsg: ''
        }
    }

    //validation for email
    validateEmail() {
        const { email } = this.props;
        var controlEmailPhone = email.indexOf('@'); // email kontrolu yapıyoruz.

        if (email.length <= 1){
            var emailValid = false;
            LayoutAnimation.easeInEaseOut();
            this.setState({ emailValid });
            this.setState({emailErrorMsg: "E-mail / Telefon boş geçilez."});
            emailValid || this.emailInput.shake();
            return emailValid;
        }else if (controlEmailPhone == -1){   // email girilmedi ise
            var vPhone = email.substring(0,1) == 0 ? email.substring(1,11) : email;
            if (vPhone.length <= 9){
                var emailValid = false;
                LayoutAnimation.easeInEaseOut();
                this.setState({ emailValid });
                this.setState({emailErrorMsg: "Lütfen geçerli bir E-mail / Telefon giriniz."});
                emailValid || this.emailInput.shake();
                return emailValid
            }
            return vPhone;
        } else { // email girildi ise
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const emailValid = re.test(email);
            LayoutAnimation.easeInEaseOut();
            this.setState({ emailValid });
            this.setState({emailErrorMsg: "Lütfen geçerli bir E-mail / Telefon giriniz."});
            emailValid || this.emailInput.shake();
            return emailValid
        }

    }

    //validation for password
    validatePassword() {
        const { password } = this.props;
        if(password.length <= 1) {
            var passwordValid = false;
            this.setState({pwdErrorMsg: "Şifre boş geçilemez."});
            LayoutAnimation.easeInEaseOut();
            this.setState({ passwordValid });
            passwordValid || this.passwordInput.shake();
            return passwordValid;
        }
        passwordValid = true;
        return passwordValid
    }

    //login press for validation check
    onPressLogin(){
        LayoutAnimation.easeInEaseOut();
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        
       if ( emailValid && passwordValid ) {
           this.props.loginUser(this.props.email, this.props.password);
        }
    }

    onEmailChanged(text){
        this.props.emailChanged(text);
    }

    onPasswordChanged(text){
        this.props.passwordChanged(text);
    }
    
    render() {
        const { onPressRegister, onPressForgotPassword } = this.props;
        const {spinnerStatus} = this.props;
        const loginButton = spinnerStatus ? (
            <SpinnerPage />
        ):(
            <Button
                title="Giriş Yapınız"
                loading={false}
                loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                titleStyle={styles.buttonTitleStyle}
                onPress={()=>{this.onPressLogin()}}
                buttonStyle={styles.loginButtonStyle}
                containerStyle={styles.loginButtonContainer}
            />
        );
        return (
            <View>
                <View style={styles.inputContainer}>
                    <Input
                        ref={input => (this.emailInput = input)}
                        editable={true}
                        underlineColorAndroid={colors.TRANSPARENT}
                        placeholder={'Email ya da Telefon'}
                        placeholderTextColor={colors.BLACK}
                        value={this.props.email}
                        keyboardType={'email-address'}
                        returnKeyType={'done'}
                        inputStyle={styles.inputTextStyle}
                        onChangeText= {this.onEmailChanged.bind(this)}
                        errorMessage={this.state.emailValid ? null : this.state.emailErrorMsg}
                        secureTextEntry={false}
                        blurOnSubmit={true}
                        autoCompleteType={'off'}
                        autoCorrect={false}
                        onSubmitEditing={() => { this.validateEmail(); this.passwordInput.focus()}}
                        errorStyle={styles.errorMessageStyle}
                        inputContainerStyle={styles.emailInputContainerStyle}
                        containerStyle={styles.emailInputContainer}
                    />
                    <Input
                        ref={input => (this.passwordInput = input)}
                        editable={true}
                        blurOnSubmit={true}
                        underlineColorAndroid={colors.TRANSPARENT}
                        placeholder={'Şifre'}
                        placeholderTextColor={colors.BLACK}
                        value={this.props.password}
                        inputStyle={styles.inputTextStyle}
                        onChangeText={this.onPasswordChanged.bind(this)}
                        errorMessage={this.state.passwordValid ? null : this.state.pwdErrorMsg}
                        secureTextEntry={true}
                        autoCompleteType={'off'}
                        autoCorrect={false}
                        returnKeyType={'done'}
                        onSubmitEditing={() => { this.validatePassword() }}
                        errorStyle={styles.errorMessageStyle}
                        inputContainerStyle={styles.pwdInputContainerStyle}
                        containerStyle={styles.pwdInputContainer}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    {loginButton}
                </View>
                <View style={styles.buttonContainer2}>
                    <Button
                        clear
                        title="Kayıt Ol"
                        loading={false}
                        loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                        titleStyle={styles.forgotTitleStyle}
                        onPress={onPressRegister}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={{width:100}}
                    />
                    <View style={styles.verticalLineStyle}/>
                    <Button
                        clear
                        title="Şifremi Unuttum"
                        loading={false}
                        onPress={onPressForgotPassword}
                        loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                        titleStyle={styles.forgotTitleStyle}
                        titleProps={{ numberOfLines: 2, ellipsizeMode: 'tail' }}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={{flex:1.7}}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        flex:1, 
        width:'90%',
        alignItems: 'flex-end',
        elevation: 20,
        justifyContent: 'flex-end',
        shadowColor: colors.BLACK, 
        shadowRadius: 10, 
        shadowOpacity: 0.6,
        shadowOffset: {width: 0, height: 4},

    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop:10
    },
    buttonContainer2: {
        flex: 1,
        flexDirection: 'row'
    },
    loginButtonContainer: { 
        flex: 1,
        ...Platform.select({
            ios: {
                elevation:5,
                shadowColor: colors.BLACK,
                shadowRadius: 10,
                shadowOpacity: 0.6,
                shadowOffset: {width: 0, height: 4}
            },
            android: {
                shadowColor: colors.BLACK,
                shadowRadius: 10,
                shadowOpacity: 0.6,
                shadowOffset: {width: 0, height: 4}
            },
        }),
    },
    loginButtonStyle: {
        backgroundColor: colors.SKY,
        height: 45,
        width:'100%',
        borderRadius: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    buttonStyle: { 
        backgroundColor: colors.BLUE.default.secondary, 
        height: 45
    },
    emailInputContainer: { 
        borderTopRightRadius:10, 
        borderTopLeftRadius: 10, 
        paddingLeft: 10,
        backgroundColor: colors.WHITE,
        paddingRight: 10, 
        paddingTop:10, 
        width: width-80
    },
    pwdInputContainer: { 
        borderBottomRightRadius:10, 
        borderBottomLeftRadius: 10, 
        paddingLeft: 10,
        backgroundColor: colors.WHITE, 
        paddingRight: 10, 
        paddingTop:5, 
        borderBottomColor:colors.WHITE, 
        borderBottomWidth: 0, 
        width: width-80
    },
    emailInputContainerStyle: {
        borderBottomColor:colors.BLACK, 
        borderBottomWidth: 1, 
        paddingBottom: 15
    },
    errorMessageStyle: { 
        fontSize: 11,
        fontWeight:'bold',
        color: "#FD2323"
    },
    inputTextStyle: {
        color:colors.BLACK,
        fontSize:16
    },
    pwdInputContainerStyle: {
        paddingBottom: 15 
    },
    verticalLineStyle: { 
        height: 25, 
        width:2, 
        top: 12, 
        backgroundColor: colors.WHITE 
    },
    buttonTitleStyle: { 
        fontWeight: "700",
        width:"100%"
    },
    forgotTitleStyle: { 
        fontWeight: "700",
        fontSize: 14,
        width:"100%"
    },
    buttonContainerStyle: {
        flex: 1
    }
});

const mapStateToProps = state => {
    const { email, password, isAut, spinnerStatus } = state.auth;
    return {
        email, password, isAut, spinnerStatus
    }
};

export default connect(mapStateToProps,
    { emailChanged, passwordChanged, loginUser  })(LoginComponent);