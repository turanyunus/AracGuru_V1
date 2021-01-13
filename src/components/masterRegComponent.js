import React, { Component } from 'react';
import {
    View, Text, Dimensions, ScrollView,
    KeyboardAvoidingView, Image, LayoutAnimation,
    Platform, Alert
} from 'react-native';
import Background from './Background';
import { Icon, Button, Input } from 'react-native-elements';
import { colors } from '../common/theme';
import {connect} from "react-redux";
import {masterNameChanged, masterSurnameChanged,
    masterRegisterEmailChanged, masterRegisterPhoneChanged,
    masterRegisterPasswordChanged, masterCreate} from "../actions";
import SpinnerPage from "../common/spinner";
import { ThirtyCharForYearsErrorMessage} from "../common/ExceptionMessage";


const {height} = Dimensions.get('window');

class MasterReg extends Component {

     constructor(props){
        super(props);
        this.state={
          confPassword:'',

          fnameValid: true,
          lnameValid: true,
          mobileValid: true,
          emailValid: true,
          passwordValid: true,
          cnfPwdValid: true,
          pwdErrorMsg: ''
        }
      }

    // first name validation
    validateFirstName() {
        const { name } = this.props;
        const fnameValid = name.length > 0;
        LayoutAnimation.easeInEaseOut();
        this.setState({ fnameValid });
        fnameValid || this.fnameInput.shake();
        return fnameValid
    }

    // last name validation
    validateLastname() {
        const { surname } = this.props;
        const lnameValid = surname.length > 0;
        LayoutAnimation.easeInEaseOut();
        this.setState({ lnameValid });
        lnameValid || this.lnameInput.shake();
        return lnameValid;
    }

    // mobile number validation
    validateMobile() {
        const { phone } = this.props;
        let mobileValid = (phone.length === 11);
        let checkZero = phone.substr(0, 1);

        if (checkZero !== '0') {
            mobileValid = false
        }
        LayoutAnimation.easeInEaseOut();
        this.setState({ mobileValid });
        mobileValid || this.mobileInput.shake();
        return mobileValid
    }

    // email validation
    validateEmail() {
        const { email } = this.props;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email);
        LayoutAnimation.easeInEaseOut();
        this.setState({ emailValid });
        emailValid || this.emailInput.shake();
        return emailValid
    }

    // password validation
    validatePassword() {
        let passwordValid = true;
        const { complexity } = this.props;
        const { password } = this.props;
        const regx1 = /^([a-zA-Z0-9@*#]{8,15})$/;
        const regx2 = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
        if(complexity === 'any') {
            passwordValid = password.length >=1;
            this.setState({pwdErrorMsg: "Şifre boş bırakılmaz."})
        }
        if(password.length <= 6) {
            this.setState({pwdErrorMsg: 'Şifre 7 karakterden az olmamalıdır.'});
            passwordValid = false
        }

        LayoutAnimation.easeInEaseOut();
        this.setState({ passwordValid });
        passwordValid || this.passwordInput.shake();
        return passwordValid
    }

    // confirm password validation
    validateConfPassword() {
        const { password } = this.props;
        const { confPassword } = this.state;
        const cnfPwdValid = (password === confPassword);
        LayoutAnimation.easeInEaseOut();
        this.setState({ cnfPwdValid });
        cnfPwdValid || this.cnfPwdInput.shake();
        return cnfPwdValid
    }

    //register button press for validation
    onPressRegister(){
        LayoutAnimation.easeInEaseOut();
        const fnameValid    = this.validateFirstName();
        const lnameValid    = this.validateLastname();
        const mobileValid   = this.validateMobile();
        const emailValid    = this.validateEmail();
        const passwordValid = this.validatePassword();
        const cnfPwdValid   = this.validateConfPassword();

        if ( fnameValid && lnameValid && mobileValid && emailValid && passwordValid && cnfPwdValid ) {
            let nameLength      = this.props.name.length;
            let surnameLength   = this.props.surname.length;
            let emailLength     = this.props.email.length;
            let phoneLength     = this.props.phone.length;
            let passwordLength  = this.props.password.length;

            if (nameLength >= 30 || surnameLength >= 30 || emailLength >= 30 || phoneLength >= 30 || passwordLength >= 30){
                Alert.alert(ThirtyCharForYearsErrorMessage);
                return;
            }
            this.props.masterCreate(this.props.name, this.props.surname, this.props.email, this.props.phone, this.props.password);
        }
    }

    onNameChanged(text){
        this.props.masterNameChanged(text);
    }

    onSurnameChanged(text){
        this.props.masterSurnameChanged(text);
    }

    onRegisterEmailChanged(text){
        this.props.masterRegisterEmailChanged(text);
    }

    onRegisterPhoneChanged(text){
        this.props.masterRegisterPhoneChanged(text);
    }

    onRegisterPasswordChanged(text){
        this.props.masterRegisterPasswordChanged(text);
    }

    render(){
        const {spinnerStatus} = this.props;
        const registerButton = spinnerStatus ? (
            <SpinnerPage />
        ):(
            <Button
                onPress={()=>{this.onPressRegister()}}
                title="Şimdi Kayıt Ol"
                titleStyle={styles.buttonTitle}
                buttonStyle={styles.registerButton}
            />
        );
        return(
            <Background>
                <ScrollView style={styles.scrollViewStyle} keyboardShouldPersistTaps={'handled'} >
                    <View style={styles.logo}>
                        <Image style={{width: 110, height: 85}} source={require('../../assets/images/logo-100.png')} />
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"padding"} style={styles.form}>
                        <View style={styles.containerStyle}>
                            <Text style={styles.headerStyle}>Usta Kayıt</Text>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.fnameInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={'Adınız'}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.props.name}
                                    keyboardType={'default'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={this.onNameChanged.bind(this)}
                                    errorMessage={this.state.fnameValid ? null : 'Lütfen isim giriniz'}
                                    secureTextEntry={false}
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateFirstName(); this.lnameInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.lnameInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={'Soyadınız'}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.props.surname}
                                    keyboardType={'default'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={this.onSurnameChanged.bind(this)}
                                    errorMessage={this.state.lnameValid ? null : 'Lütfen soyisim giriniz'}
                                    secureTextEntry={false}
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateLastname(); this.emailInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='envelope-o'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={23}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.emailInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={'Email'}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.props.email}
                                    keyboardType={'email-address'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={this.onRegisterEmailChanged.bind(this)}
                                    errorMessage={this.state.emailValid ? null : 'Lütfen geçerli bir E-Mail adresi giriniz'}
                                    secureTextEntry={false}
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateEmail(); this.mobileInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='mobile-phone'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={40}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.mobileInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={'Telefon (05xx)'}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.props.phone}
                                    keyboardType={'numeric'}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={this.onRegisterPhoneChanged.bind(this)}
                                    errorMessage={this.state.mobileValid ? null : 'Lütfen geçerli bir telefon numarası giriniz'}
                                    secureTextEntry={false}
                                    returnKeyType={'done'}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateMobile(); this.passwordInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='lock'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.passwordInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={'Şifre'}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.props.password}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={this.onRegisterPasswordChanged.bind(this)}
                                    errorMessage={this.state.passwordValid ? null : this.state.pwdErrorMsg}
                                    secureTextEntry={true}
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validatePassword(); this.cnfPwdInput.focus()}}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon
                                    name='lock'
                                    type='font-awesome'
                                    color={colors.WHITE}
                                    size={30}
                                    containerStyle={styles.iconContainer}
                                />
                                <Input
                                    ref={input => (this.cnfPwdInput = input)}
                                    editable={true}
                                    underlineColorAndroid={colors.TRANSPARENT}
                                    placeholder={'Şifre (Tekrar)'}
                                    placeholderTextColor={colors.WHITE}
                                    value={this.state.confPassword}
                                    inputStyle={styles.inputTextStyle}
                                    onChangeText={(text)=>{this.setState({confPassword: text})}}
                                    errorMessage={this.state.cnfPwdValid ? null : 'Şifreler eşleşmiyor'}
                                    secureTextEntry={true}
                                    returnKeyType={'done'}
                                    blurOnSubmit={true}
                                    onSubmitEditing={() => { this.validateConfPassword() }}
                                    errorStyle={styles.errorMessageStyle}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    containerStyle={styles.textInputStyle}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                {registerButton}
                            </View>
                            <View style={styles.gapView}/>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Background>
        );
    }
};

const styles={
    inputContainerStyle: {
        borderBottomWidth:1,
        borderBottomColor: colors.WHITE
    },
    textInputStyle:{
        marginLeft:10,
    },
    iconContainer: {
        paddingTop:8
    },
    gapView: {
        height:40,
        width:'100%'
    },
    buttonContainer: {
        flexDirection:'row',
        justifyContent:'center',
        borderRadius:40
    },
    registerButton: {
        backgroundColor: colors.SKY,
        width: 180,
        height: 50,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        marginTop:30,
        borderRadius:15,
    },
    buttonTitle: {
        fontSize:20
    },
    inputTextStyle: {
        color:colors.WHITE,
        fontSize:16,
        marginLeft:0,
        height:32
    },
    errorMessageStyle: {
        fontSize: 15,
        fontWeight:'bold',
        marginLeft:0
    },
    containerStyle:{
        flexDirection:'column',
        marginTop:20
    },
    form: {
        flex: 1,
    },
    logo:{
        width:'100%',
        justifyContent:"flex-start",
        marginTop: 40,
        alignItems:'center',
    },
    scrollViewStyle:{
        height: height
    },
    textInputContainerStyle:{
        flexDirection:'row',
        alignItems: "center",
        marginLeft:20,
        marginRight:20,
        padding: 15,

    },
    headerStyle:{
        fontSize:20,
        color:colors.WHITE,
        textAlign:'center',
        flexDirection:'row',
        marginTop:0
    },
    capturePhoto:{
        width: '80%',
        alignSelf: 'center',
        flexDirection:'column',
        justifyContent:'center',
        borderRadius:10,
        backgroundColor:colors.WHITE,
        marginLeft:20,
        marginRight:20,
        paddingTop:15,
        paddingBottom:10,
        marginTop:15
    },
    capturePhotoTitle:{
        color: colors.BLACK,
        fontSize:17,
        textAlign:'center',
        paddingBottom:15,

    },
    errorPhotoTitle: {
        color:colors.RED,
        fontSize:17,
        textAlign:'center',
        paddingBottom:15,
    },
    photoResult:{
        alignSelf: 'center',
        flexDirection:'column',
        justifyContent:'center',
        borderRadius:10,
        marginLeft:20,
        marginRight:20,
        paddingTop:15,
        paddingBottom:10,
        marginTop:15,
        width: '80%',
        height: height/4
    },
    imagePosition:{
        position:'relative'
    },
    photoClick:{
        paddingRight:48,
        position:'absolute',
        zIndex:1,
        marginTop:18,
        alignSelf:'flex-end'
    },
    capturePicClick: {
        backgroundColor:colors.WHITE,
        flexDirection: 'row',
        position:'relative',
        zIndex:1
    },
    imageStyle:{
        width: 30,
        height: height/15
    },
    flexView1:{
        flex:12
    },
    imageFixStyle:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center'
    },
    imageStyle2:{
        width: 150,
        height: height/15
    },
    myView:{
        flex:2,
        height:50,
        width: 1,
        alignItems: 'center'
    },
    myView1:{
        height: height/18,
        width: 1.5,
        backgroundColor:colors.GREY.btnSecondary,
        alignItems: 'center',
        marginTop: 10
    },
    myView2:{
        flex:20,
        alignItems: 'center',
        justifyContent:'center'
    },
    myView3:{
        flex: 2.2,
        alignItems: 'center',
        justifyContent:'center'
    },
    textStyle:{
        color: colors.GREY.btnPrimary,
        fontFamily: 'Roboto-Bold',
        fontSize: 14.5
    }
}

const mapStateToProps = state => {
    const { name, surname, email, phone, password, spinnerStatus } = state.masterRegister;
    return {
        name, surname, email, phone, password, spinnerStatus
    }
}

export default connect(mapStateToProps,
    { masterNameChanged, masterSurnameChanged, masterRegisterEmailChanged, masterRegisterPhoneChanged, masterRegisterPasswordChanged, masterCreate })(MasterReg);
